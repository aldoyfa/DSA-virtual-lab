export const setIsRunning = (payload) => ({ type: 'SET_RUNNING', payload });
export const setCurrentComparisons = (payload) => ({ type: 'SET_COMPARISONS', payload });
export const setCurrentSwappers = (payload) => ({ type: 'SET_SWAPPERS', payload });
export const setCurrentSorted = (payload) => ({ type: 'SET_SORTED', payload });
export const setPivot = (payload) => ({ type: 'SET_PIVOT', payload });
export const setSpeed = (payload) => ({ type: 'SET_SPEED', payload });
export const resetVisualization = () => ({ type: 'RESET_VISUALIZATION' });

export default {};