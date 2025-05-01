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

export const fetchSearchId = createAsyncThunk('tickets/fetchSearchIdStatus', async (_, thunkAPI) => {
  try {
    const {
      data: { searchId },
    } = await axios.get('https://aviasales-test-api.kata.academy/search');
    return searchId;
  } catch (error) {
    return thunkAPI.rejectWithValue('Не удалось получить ID');
  }
});

export const fetchTickets = createAsyncThunk('tickets/fetchTicketsStatus', async (_, thunkAPI) => {
  try {
    const { payload: searchId } = await thunkAPI.dispatch(fetchSearchId());
    let stop = false;
    let errorCount = 0;
    const maxErrors = 5;
    let allTickets = [];

    while (!stop && errorCount < maxErrors) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const response = await axios.get(`https://aviasales-test-api.kata.academy/tickets?searchId=${searchId}`);
        allTickets = [...allTickets, ...response.data.tickets];
        stop = response.data.stop;
        errorCount = 0;
      } catch {
        errorCount += 1;
        if (errorCount >= maxErrors) {
          return thunkAPI.rejectWithValue('Слишком много ошибок при загрузке билетов');
        }
        console.log(errorCount);
      }
    }
    return allTickets;
  } catch (error) {
    return thunkAPI.rejectWithValue('Ошибка при получении searchId');
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
        state.error = null;
        state.tickets = [];
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.status = 'success';
        state.tickets = action.payload;
        state.stop = true;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      });
  },
});

export const { setTickets, setFilters, addTickets } = ticketSlice.actions;

export default ticketSlice.reducer;
