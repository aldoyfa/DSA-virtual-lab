import { setArray } from '../store/slices/arraySlice'
import { setCurrentComparisons, setCurrentSwappers, setCurrentSorted } from '../store/slices/visualizationSlice'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const mergeSort = async (inputArray, dispatch, speed) => {
  const array = [...inputArray]
  const auxiliaryArray = [...array]
  const sortedIndices = new Set()
  
  const mergeSortHelper = async (arr, auxArr, left, right) => {
    if (left === right) return
    
    const mid = Math.floor((left + right) / 2)
    
    await mergeSortHelper(auxArr, arr, left, mid)
    await mergeSortHelper(auxArr, arr, mid + 1, right)
    await merge(arr, auxArr, left, mid, right)
  }
  
  const merge = async (mainArray, auxArray, left, mid, right) => {
    let i = left
    let j = mid + 1
    let k = left
    
    while (i <= mid && j <= right) {
      dispatch(setCurrentComparisons([i, j]))
      await delay(speed)
      
      if (auxArray[i] <= auxArray[j]) {
        mainArray[k] = auxArray[i]
        i++
      } else {
        dispatch(setCurrentSwappers([k, j]))
        mainArray[k] = auxArray[j]
        j++
        await delay(speed / 2)
        dispatch(setCurrentSwappers([]))
      }
      
      sortedIndices.add(k)
      dispatch(setArray([...mainArray]))
      dispatch(setCurrentSorted([...sortedIndices]))
      k++
    }
    
    while (i <= mid) {
      mainArray[k] = auxArray[i]
      sortedIndices.add(k)
      dispatch(setArray([...mainArray]))
      dispatch(setCurrentSorted([...sortedIndices]))
      i++
      k++
      await delay(speed / 2)
    }
    
    while (j <= right) {
      mainArray[k] = auxArray[j]
      sortedIndices.add(k)
      dispatch(setArray([...mainArray]))
      dispatch(setCurrentSorted([...sortedIndices]))
      j++
      k++
      await delay(speed / 2)
    }
    
    dispatch(setCurrentComparisons([]))
  }
  
  await mergeSortHelper(array, auxiliaryArray, 0, array.length - 1)
}