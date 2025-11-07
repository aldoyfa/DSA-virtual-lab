import { setArray } from '../store/slices/arraySlice'
import { setCurrentComparisons, setCurrentSwappers, setCurrentSorted } from '../store/slices/visualizationSlice'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, Math.max(10, ms)))

export const bubbleSort = async (inputArray, dispatch, speed) => {
  try {
    const array = [...inputArray]
    const n = array.length
    const sortedIndices = new Set()
    
    if (n <= 1) {
      dispatch(setCurrentSorted([0]))
      return
    }
    
    for (let i = 0; i < n - 1; i++) {
      let swapped = false
      
      for (let j = 0; j < n - i - 1; j++) {
        // Highlight elements being compared
        dispatch(setCurrentComparisons([j, j + 1]))
        await delay(speed)
        
        if (array[j] > array[j + 1]) {
          // Highlight elements being swapped
          dispatch(setCurrentSwappers([j, j + 1]))
          
          // Wait a bit to show the swap highlighting
          await delay(speed / 2)
          
          // Perform swap in local array
          const temp = array[j]
          array[j] = array[j + 1]
          array[j + 1] = temp
          
          // Update the array in store with new reference
          const newArray = [...array]
          dispatch(setArray(newArray))
          swapped = true
          
          await delay(speed / 2)
          
          // Clear swappers
          dispatch(setCurrentSwappers([]))
        }
        
        // Clear comparisons
        dispatch(setCurrentComparisons([]))
      }
      
      // Mark the last element of this pass as sorted
      sortedIndices.add(n - 1 - i)
      dispatch(setCurrentSorted([...sortedIndices]))
      
      if (!swapped) {
        // If no swaps occurred, the remaining elements are already sorted
        for (let k = 0; k < n - i - 1; k++) {
          sortedIndices.add(k)
        }
        dispatch(setCurrentSorted([...sortedIndices]))
        break
      }
    }
    
    // Mark the first element as sorted (it will be sorted after all passes)
    if (!sortedIndices.has(0)) {
      sortedIndices.add(0)
      dispatch(setCurrentSorted([...sortedIndices]))
    }

  } catch (error) {
    console.error('Error in bubble sort:', error)
    throw error
  }
}