import { configureStore } from '@reduxjs/toolkit';
import category from './categorySlice';
import checkbox from './checkboxSlice';
import tickets from './ticketSlice';

const store = configureStore({
  reducer: { category, checkbox, tickets },
});

export default store;
