import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setAlgorithm } from '../../store/slices/algorithmSlice'
import { generateRandomArray, setArray } from '../../store/slices/arraySlice'
import { resetVisualization, setIsRunning, setSpeed } from '../../store/slices/visualizationSlice'
import { startSorting } from '../../algorithms'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import './Toolbar.css'

const Toolbar = () => {
  const dispatch = useDispatch()
  const { user, logout } = useAuth()
  const array = useSelector(state => state.array.data)
  const selectedAlgorithm = useSelector(state => state.algorithm.selected)
  const isRunning = useSelector(state => state.visualization.isRunning)
  const speed = useSelector(state => state.visualization.speed)

  useEffect(() => {
    // Load saved state on mount
    const loadSavedState = async () => {
      try {
        const response = await api.getLatestState()
        if (response.success && response.data && response.data.state) {
          const savedState = response.data.state
          if (savedState.arrayData && Array.isArray(savedState.arrayData)) {
            dispatch(setArray(savedState.arrayData))
          } else {
            dispatch(generateRandomArray(87))
          }
          if (savedState.algorithm) {
            dispatch(setAlgorithm(savedState.algorithm))
          }
          if (savedState.speed) {
            dispatch(setSpeed(savedState.speed))
          }
        } else {
          // Generate initial array if no saved state
          dispatch(generateRandomArray(87))
        }
      } catch (error) {
        console.log('No saved state found, generating new array')
        // Generate initial array on error
        dispatch(generateRandomArray(87))
      }
    }

    loadSavedState()
  }, [dispatch])

  // Auto-save state when array, algorithm, or speed changes
  useEffect(() => {
    if (!isRunning && array.length > 0 && selectedAlgorithm) {
      const saveState = async () => {
        try {
          await api.saveState({
            algorithm: selectedAlgorithm,
            arrayData: array,
            arraySize: array.length,
            speed: speed
          })
          console.log('State saved successfully')
        } catch (error) {
          console.error('Failed to save state:', error)
        }
      }

      // Debounce the save operation
      const timeoutId = setTimeout(saveState, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [array, selectedAlgorithm, speed, isRunning])

  const handleAlgorithmClick = (algorithm) => {
    if (!isRunning) {
      dispatch(setAlgorithm(algorithm))
    }
  }

  const handleGenerateArray = () => {
    if (!isRunning) {
      dispatch(generateRandomArray(array.length))
      dispatch(resetVisualization())
    }
  }

  const handleSizeChange = (event) => {
    if (!isRunning) {
      const newSize = Math.floor((parseInt(event.target.value) + 3) * 1.65)
      dispatch(generateRandomArray(newSize))
      dispatch(resetVisualization())
    }
  }

  const handleSpeedChange = (event) => {
    if (!isRunning) {
      const sliderValue = parseInt(event.target.value)
      // Map slider value 1-10001 to speed range 500ms to 0.05ms (for exactly 10000X)
      // Higher slider value = faster speed (lower ms)
      const newSpeed = 500 / Math.pow(10, (sliderValue - 1) / 2500)
      dispatch(setSpeed(newSpeed))
    }
  }

  const handleSort = () => {
    if (!isRunning && selectedAlgorithm && array.length > 0) {
      startSorting(selectedAlgorithm, array, speed, dispatch)
        .catch(error => {
          console.error('Sort failed:', error)
          dispatch(setIsRunning(false))
          dispatch(resetVisualization())
        })
    }
  }

  const buttonStyle = {
    color: isRunning ? "rgba(214, 29, 29, 0.8)" : "white",
    cursor: isRunning ? "auto" : "pointer"
  }

  const algorithms = [
    { key: 'mergeSort', label: 'Merge Sort' },
    { key: 'quickSort', label: 'Quick Sort' },
    { key: 'heapSort', label: 'Heap Sort' },
    { key: 'bubbleSort', label: 'Bubble Sort' }
  ]

  const handleLogout = async () => {
    if (!isRunning) {
      await logout()
    }
  }

  const handleChangeTopic = () => {
    if (!isRunning) {
      // Just reload the page, App.jsx will handle showing topic selector
      window.location.reload()
    }
  }

  return (
    <div className="toolbar">
      <div className="user-info">
        <span className="username">{user?.username || 'Guest'}</span>
        <button
          className="change-topic-button"
          onClick={handleChangeTopic}
          disabled={isRunning}
          title="Change Topic"
        >
          Change Topic
        </button>
        <button
          className="logout-button"
          onClick={handleLogout}
          disabled={isRunning}
          title="Logout"
        >
          Logout
        </button>
      </div>

      <div className="separator" />

      <button
        className="toolbar-button"
        style={buttonStyle}
        onClick={handleGenerateArray}
        disabled={isRunning}
      >
        Generate New Array
      </button>

      <div className="separator" />

      <div className="control-group">
        <label className="control-label" style={{ color: buttonStyle.color }}>
          Array Size
        </label>
        <input
          type="range"
          min="10"
          max="100"
          defaultValue="50"
          className="size-slider"
          disabled={isRunning}
          onChange={handleSizeChange}
        />
        <div className="control-spacer"></div>
      </div>

      <div className="separator" />

      <div className="control-group">
        <label className="control-label" style={{ color: buttonStyle.color }}>
          Speed
        </label>
        <input
          type="range"
          min="1"
          max="10001"
          value={Math.log10(500 / speed) * 2500 + 1}
          className="size-slider speed-slider"
          disabled={isRunning}
          onChange={handleSpeedChange}
        />
        <span className="speed-value" style={{ color: buttonStyle.color, fontSize: '0.75rem' }}>
          {(500 / speed).toFixed(1)}X
        </span>
      </div>

      <div className="separator" />

      <div className="algorithm-buttons">
        {algorithms.map(({ key, label }) => (
          <button
            key={key}
            className={`algorithm-button ${selectedAlgorithm === key ? 'active' : ''}`}
            onClick={() => handleAlgorithmClick(key)}
            disabled={isRunning}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="separator" />

      {selectedAlgorithm && (
        <button
          className="sort-button"
          style={buttonStyle}
          onClick={handleSort}
          disabled={isRunning}
        >
          Sort!
        </button>
      )}
    </div>
  )
}

export default Toolbar