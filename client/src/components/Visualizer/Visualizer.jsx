import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import './Visualizer.css'

const Visualizer = () => {
  const array = useSelector(state => state.array.data)
  const currentComparisons = useSelector(state => state.visualization.currentComparisons)
  const currentSwappers = useSelector(state => state.visualization.currentSwappers)
  const currentSorted = useSelector(state => state.visualization.currentSorted)
  const pivot = useSelector(state => state.visualization.pivot)

  const containerWidth = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth
    }
    return 1200 // fallback width
  }, [])

  const elementStyle = useMemo(() => {
    const numWidth = Math.floor(containerWidth / (array.length * 3))
    const width = `${numWidth}px`
    
    const numMargin = array.length < 5 ? 10 : 
                     array.length < 8 ? 8 : 
                     array.length < 11 ? 6 : 
                     array.length < 20 ? 4 : 
                     array.length < 50 ? 3.5 : 
                     array.length < 100 ? 3 : 
                     array.length < 130 ? 2.5 : 2
    const margin = `${numMargin}px`
    
    const color = numWidth > 20 ? "white" : "transparent"
    
    const numFont = numWidth > 70 ? 20 : 
                   numWidth > 60 ? 18 : 
                   numWidth > 50 ? 16 : 
                   numWidth > 40 ? 14 : 
                   numWidth > 30 ? 12 : 
                   numWidth > 20 ? 10 : 8
    const fontSize = `${numFont}px`

    return { width, margin, color, fontSize }
  }, [array.length, containerWidth])

  const getElementColor = (index) => {
    if (currentSwappers.includes(index)) {
      return "rgba(219, 57, 57, 0.8)" // Red for swapping
    }
    if (currentComparisons.includes(index)) {
      return "rgba(78, 216, 96, 0.8)" // Green for comparing
    }
    if (pivot === index) {
      return "rgba(237, 234, 59, 0.8)" // Yellow for pivot
    }
    if (currentSorted.includes(index)) {
      return "rgba(169, 92, 232, 0.8)" // Purple for sorted
    }
    return "rgba(66, 134, 244, 0.8)" // Blue for default
  }

  return (
    <div className="visualizer">
      <div className="array-container">
        {array.map((value, index) => (
          <div
            key={`element-${index}`}
            className="array-element"
            style={{
              height: `${value * 3}px`,
              width: elementStyle.width,
              marginLeft: elementStyle.margin,
              marginRight: elementStyle.margin,
              backgroundColor: getElementColor(index),
              color: elementStyle.color,
              fontSize: elementStyle.fontSize,
            }}
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Visualizer