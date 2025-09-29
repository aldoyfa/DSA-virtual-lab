import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selected: null,
  available: ['bubbleSort', 'quickSort', 'mergeSort', 'heapSort']
}

export const algorithmSlice = createSlice({
  name: 'algorithm',
  initialState,
  reducers: {
    setAlgorithm: (state, action) => {
      if (state.available.includes(action.payload)) {
        state.selected = action.payload
      }
    },
    clearAlgorithm: (state) => {
      state.selected = null
    }
  },
})

export const { setAlgorithm, clearAlgorithm } = algorithmSlice.actions
export default algorithmSlice.reducer