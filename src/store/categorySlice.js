import { createSlice } from '@reduxjs/toolkit';

const initialState = [
  { id: '1', name: 'САМЫЙ ДЕШЕВЫЙ', active: true },
  { id: '2', name: 'САМЫЙ БЫСТРЫЙ', active: false },
  { id: '3', name: 'ОПТИМАЛЬНЫЙ', active: false },
];

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategory(state, action) {
      const id = action.payload;
      return state.map((item) => ({
        ...item,
        active: item.id === id,
      }));
    },
  },
});

export const { setCategory } = categorySlice.actions;

export default categorySlice.reducer;
