export const setArray = (payload) => ({ type: 'SET_ARRAY', payload });

export const generateRandomArray = (length = 50) => ({
  type: 'SET_ARRAY',
  payload: Array.from({ length }, () => Math.floor(Math.random() * 200) + 10),
});

export default {};