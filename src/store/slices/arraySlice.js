import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: [],
}

export const arraySlice = createSlice({
  name: 'array',
  initialState,
  reducers: {
    setArray: (state, action) => {
      state.data = action.payload
    },
    generateRandomArray: (state, action) => {
      const length = action.payload || 50
      const array = []
      while (array.length < length) {
        array.push(Math.floor(Math.random() * 200) + 10)
      }
      state.data = array
    },
    updateArrayElement: (state, action) => {
      const { index, value } = action.payload
      if (index >= 0 && index < state.data.length) {
        state.data[index] = value
      }
    },
    swapElements: (state, action) => {
      const { index1, index2 } = action.payload
      if (index1 >= 0 && index1 < state.data.length && 
          index2 >= 0 && index2 < state.data.length) {
        const temp = state.data[index1]
        state.data[index1] = state.data[index2]
        state.data[index2] = temp
      }
    }
  },
})

export const { setArray, generateRandomArray, updateArrayElement, swapElements } = arraySlice.actions
export default arraySlice.reducer