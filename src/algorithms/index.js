import { setIsRunning, setCurrentComparisons, setCurrentSwappers, setCurrentSorted, setPivot, resetVisualization } from '../store/slices/visualizationSlice'
import { bubbleSort } from './bubbleSort'
import { quickSort } from './quickSort'
import { mergeSort } from './mergeSort'
import { heapSort } from './heapSort'

export const startSorting = async (algorithm, array, speed, dispatch) => {
  // Reset visualization state
  dispatch(resetVisualization())
  dispatch(setIsRunning(true))

  let sortFunction
  switch (algorithm) {
    case 'bubbleSort':
      sortFunction = bubbleSort
      break
    case 'quickSort':
      sortFunction = quickSort
      break
    case 'mergeSort':
      sortFunction = mergeSort
      break
    case 'heapSort':
      sortFunction = heapSort
      break
    default:
      console.error('Unknown algorithm:', algorithm)
      dispatch(setIsRunning(false))
      throw new Error(`Unknown algorithm: ${algorithm}`)
  }

  try {
    await sortFunction(array, dispatch, speed)
    
    // Show final sorted state
    const allIndices = Array.from({ length: array.length }, (_, index) => index)
    dispatch(setCurrentSorted(allIndices))
    dispatch(setCurrentComparisons([]))
    dispatch(setCurrentSwappers([]))
    dispatch(setPivot(null))
    
    setTimeout(() => {
      dispatch(setIsRunning(false))
    }, 1000)
    
  } catch (error) {
    console.error('Sorting error:', error)
    dispatch(setIsRunning(false))
    dispatch(resetVisualization())
    throw error
  }
}