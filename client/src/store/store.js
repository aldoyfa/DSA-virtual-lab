import { configureStore } from '@reduxjs/toolkit'
import arraySlice from './slices/arraySlice'
import algorithmSlice from './slices/algorithmSlice'
import visualizationSlice from './slices/visualizationSlice'

export const store = configureStore({
  reducer: {
    array: arraySlice,
    algorithm: algorithmSlice,
    visualization: visualizationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['visualization/setAnimationTimeout'],
      },
    }),
})

// Export types for TypeScript usage if needed
// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch