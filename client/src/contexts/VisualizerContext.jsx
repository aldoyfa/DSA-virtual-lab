import { createContext, useContext, useReducer } from 'react';

const initialState = {
  array: [],
  algorithm: null,
  isRunning: false,
  currentComparisons: [],
  currentSwappers: [],
  currentSorted: [],
  pivot: null,
  speed: 100,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ARRAY':
      return { ...state, array: action.payload };
    case 'SET_ALGORITHM':
      return { ...state, algorithm: action.payload };
    case 'SET_RUNNING':
      return { ...state, isRunning: action.payload };
    case 'SET_COMPARISONS':
      return { ...state, currentComparisons: action.payload };
    case 'SET_SWAPPERS':
      return { ...state, currentSwappers: action.payload };
    case 'SET_SORTED':
      return { ...state, currentSorted: action.payload };
    case 'SET_PIVOT':
      return { ...state, pivot: action.payload };
    case 'SET_SPEED':
      return { ...state, speed: action.payload };
    case 'RESET_VISUALIZATION':
      return {
        ...state,
        isRunning: false,
        currentComparisons: [],
        currentSwappers: [],
        currentSorted: [],
        pivot: null,
      };
    default:
      return state;
  }
}

const VisualizerContext = createContext(null);

export const VisualizerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <VisualizerContext.Provider value={{ state, dispatch }}>
      {children}
    </VisualizerContext.Provider>
  );
};

export const useVisualizer = () => {
  const ctx = useContext(VisualizerContext);
  if (!ctx) throw new Error('useVisualizer must be used within VisualizerProvider');
  return ctx;
};
