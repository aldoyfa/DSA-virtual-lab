import { setArray } from '../store/slices/arraySlice'
import { setCurrentComparisons, setCurrentSwappers, setCurrentSorted } from '../store/slices/visualizationSlice'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const heapSort = async (inputArray, dispatch, speed) => {
  const array = [...inputArray]
  const n = array.length
  const sortedIndices = new Set()
  
  // Build heap (rearrange array)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(array, n, i, dispatch, speed, sortedIndices)
  }
  
  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    dispatch(setCurrentSwappers([0, i]))
    ;[array[0], array[i]] = [array[i], array[0]]
    dispatch(setArray([...array]))
    await delay(speed)
    dispatch(setCurrentSwappers([]))
    
    // Mark as sorted
    sortedIndices.add(i)
    dispatch(setCurrentSorted([...sortedIndices]))
    
    // Call heapify on the reduced heap
    await heapify(array, i, 0, dispatch, speed, sortedIndices)
  }
  
  // Mark the first element as sorted
  sortedIndices.add(0)
  dispatch(setCurrentSorted([...sortedIndices]))
}

const heapify = async (array, n, rootIndex, dispatch, speed, sortedIndices) => {
  let largest = rootIndex
  const left = 2 * rootIndex + 1
  const right = 2 * rootIndex + 2
  
  // Check left child
  if (left < n) {
    dispatch(setCurrentComparisons([largest, left]))
    await delay(speed / 2)
    
    if (array[left] > array[largest]) {
      largest = left
    }
  }
  
  // Check right child
  if (right < n) {
    dispatch(setCurrentComparisons([largest, right]))
    await delay(speed / 2)
    
    if (array[right] > array[largest]) {
      largest = right
    }
  }
  
  dispatch(setCurrentComparisons([]))
  
  // If largest is not root, swap and continue heapifying
  if (largest !== rootIndex) {
    dispatch(setCurrentSwappers([rootIndex, largest]))
    ;[array[rootIndex], array[largest]] = [array[largest], array[rootIndex]]
    dispatch(setArray([...array]))
    await delay(speed)
    dispatch(setCurrentSwappers([]))
    
    // Recursively heapify the affected sub-tree
    await heapify(array, n, largest, dispatch, speed, sortedIndices)
  }
}