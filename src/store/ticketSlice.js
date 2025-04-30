import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  filters: ['Без пересадок', '1 пересадка', '2 пересадки', '3 пересадки'],
  tickets: [],
  count: 5,
  status: 'loading',
  stop: false,
  error: null,
};

export const fetchSearchId = createAsyncThunk('tickets/fetchSearchIdStatus', async (thunkAPI) => {
  try {
    const {
      data: { searchId },
    } = await axios.get('https://aviasales-test-api.kata.academy/search');
    return searchId;
  } catch (error) {
    return thunkAPI.rejectWithValue('Не удалось получить ID');
  }
});

export const fetchTickets = createAsyncThunk('tickets/fetchTicketsStatus', async (params, thunkAPI) => {
  const { payload } = params;
  try {
    const {
      data: { tickets },
    } = await axios.get(`https://aviasales-test-api.kata.academy/tickets?searchId=${payload}`);
    return tickets;
  } catch (error) {
    return thunkAPI.rejectWithValue('Не удалось загрузить билеты');
  }
});

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    addTickets(state) {
      state.count += 5;
    },
    setFilters(state, action) {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.status = 'loading';
        state.tickets = [];
        state.error = null;
        state.stop = false;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.tickets = action.payload;
        state.status = 'success';
        state.error = null;
        state.stop = true;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.status = 'error';
        state.tickets = [];
        state.error = action.payload;
        state.stop = false;
      });
  },
});

export const { setTickets, setFilters, addTickets } = ticketSlice.actions;

export default ticketSlice.reducer;
