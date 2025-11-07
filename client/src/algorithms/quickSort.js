import { setArray } from '../store/slices/arraySlice'
import { setCurrentComparisons, setCurrentSwappers, setPivot, setCurrentSorted } from '../store/slices/visualizationSlice'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const quickSort = async (inputArray, dispatch, speed) => {
  const array = [...inputArray]
  const sortedIndices = new Set()
  
  const quickSortHelper = async (arr, low, high) => {
    if (low < high) {
      const pivotIndex = await partition(arr, low, high)
      sortedIndices.add(pivotIndex)
      dispatch(setCurrentSorted([...sortedIndices]))
      
      await Promise.all([
        quickSortHelper(arr, low, pivotIndex - 1),
        quickSortHelper(arr, pivotIndex + 1, high)
      ])
    } else if (low === high) {
      sortedIndices.add(low)
      dispatch(setCurrentSorted([...sortedIndices]))
    }
  }
  
  const partition = async (arr, low, high) => {
    const pivot = arr[high]
    dispatch(setPivot(high))
    let i = low - 1
    
    for (let j = low; j < high; j++) {
      dispatch(setCurrentComparisons([j, high]))
      await delay(speed)
      
      if (arr[j] < pivot) {
        i++
        if (i !== j) {
          dispatch(setCurrentSwappers([i, j]));
          [arr[i], arr[j]] = [arr[j], arr[i]]
          dispatch(setArray([...arr]))
          await delay(speed)
          dispatch(setCurrentSwappers([]))
        }
      }
    }
    
    if (i + 1 !== high) {
      dispatch(setCurrentSwappers([i + 1, high]));
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
      dispatch(setArray([...arr]))
      await delay(speed)
      dispatch(setCurrentSwappers([]))
    }
    
    dispatch(setCurrentComparisons([]))
    dispatch(setPivot(null))
    
    return i + 1
  }
  
  await quickSortHelper(array, 0, array.length - 1)
}