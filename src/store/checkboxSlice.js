import { createSlice } from '@reduxjs/toolkit';

const initialState = [
  { id: '1', name: 'Без пересадок', checked: true },
  { id: '2', name: '1 пересадка', checked: true },
  { id: '3', name: '2 пересадки', checked: true },
  { id: '4', name: '3 пересадки', checked: true },
];

const checkboxSlice = createSlice({
  name: 'checkboxes',
  initialState,
  reducers: {
    setSelectedValues(state, action) {
      const { payload } = action;
      return state.map((item) => {
        const findedItem = payload.find((name) => item.name === name);
        if (findedItem) {
          return { ...item, checked: true };
        }
        return { ...item, checked: false };
      });
    },
    setSelectedAllValues(state, action) {
      const { payload } = action;
      return state.map((item) => ({ ...item, checked: payload }));
    },
  },
});

export const selectCheckbox = (state) => state.checkbox;

export const { setSelectedValues, setSelectedAllValues } = checkboxSlice.actions;

export default checkboxSlice.reducer;
