import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setAlgorithm } from '../../store/slices/algorithmSlice'
import { generateRandomArray } from '../../store/slices/arraySlice'
import { resetVisualization, setIsRunning } from '../../store/slices/visualizationSlice'
import { startSorting } from '../../algorithms'
import './Toolbar.css'

const Toolbar = () => {
  const dispatch = useDispatch()
  const array = useSelector(state => state.array.data)
  const selectedAlgorithm = useSelector(state => state.algorithm.selected)
  const isRunning = useSelector(state => state.visualization.isRunning)

  useEffect(() => {
    // Generate initial array
    dispatch(generateRandomArray(87))
  }, [dispatch])

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



  const handleSort = () => {
    if (!isRunning && selectedAlgorithm && array.length > 0) {
      const calculatedSpeed = Math.max(50, 570 - Math.pow(array.length, 2))
      startSorting(selectedAlgorithm, array, calculatedSpeed, dispatch)
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

  return (
    <div className="toolbar">
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
          Array Size & Speed
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