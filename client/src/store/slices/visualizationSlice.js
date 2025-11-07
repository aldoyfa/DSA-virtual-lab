import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isRunning: false,
  currentComparisons: [],
  currentSwappers: [],
  currentSorted: [],
  pivot: null,
  speed: 100,
  animationTimeout: null
}

export const visualizationSlice = createSlice({
  name: 'visualization',
  initialState,
  reducers: {
    setIsRunning: (state, action) => {
      state.isRunning = action.payload
    },
    setCurrentComparisons: (state, action) => {
      state.currentComparisons = action.payload
    },
    setCurrentSwappers: (state, action) => {
      state.currentSwappers = action.payload
    },
    setCurrentSorted: (state, action) => {
      state.currentSorted = action.payload
    },
    setPivot: (state, action) => {
      state.pivot = action.payload
    },
    setSpeed: (state, action) => {
      state.speed = action.payload
    },
    setAnimationTimeout: (state, action) => {
      state.animationTimeout = action.payload
    },
    clearVisualization: (state) => {
      state.currentComparisons = []
      state.currentSwappers = []
      state.pivot = null
    },
    resetVisualization: (state) => {
      state.isRunning = false
      state.currentComparisons = []
      state.currentSwappers = []
      state.currentSorted = []
      state.pivot = null
      if (state.animationTimeout) {
        clearTimeout(state.animationTimeout)
        state.animationTimeout = null
      }
    }
  },
})

export const { 
  setIsRunning, 
  setCurrentComparisons, 
  setCurrentSwappers, 
  setCurrentSorted, 
  setPivot, 
  setSpeed,
  setAnimationTimeout,
  clearVisualization,
  resetVisualization 
} = visualizationSlice.actions

export default visualizationSlice.reducer