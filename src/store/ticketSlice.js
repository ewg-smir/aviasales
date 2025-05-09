import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import axios from 'axios';

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

export const fetchTickets = createAsyncThunk('tickets/fetchTicketsStatus', async (searchId, thunkAPI) => {
  try {
    let stop = false;
    let errorCount = 0;
    const maxErrors = 5;

    while (!stop && errorCount < maxErrors) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const response = await axios.get(`https://aviasales-test-api.kata.academy/tickets?searchId=${searchId}`);
        thunkAPI.dispatch(addTicketsPart(response.data.tickets));
        stop = response.data.stop;
        errorCount = 0;
      } catch {
        errorCount += 1;
        if (errorCount >= maxErrors) {
          return thunkAPI.rejectWithValue('Слишком много ошибок при загрузке билетов');
        }
      }
    }
    return true;
  } catch (error) {
    return thunkAPI.rejectWithValue('Ошибка при получении searchId');
  }
});

const initialState = {
  filters: ['Без пересадок', '1 пересадка', '2 пересадки', '3 пересадки'],
  tickets: [],
  count: 5,
  searchId: null,
  status: 'loading',
  stop: false,
  error: null,
  loadingMore: false,
};

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
    addTicketsPart(state, action) {
      const newTickets = action.payload.map((ticket) => ({
        ...ticket,
        _id: nanoid(),
      }));
      state.tickets = [...state.tickets, ...newTickets];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        if (!state.loadingMore) {
          state.tickets = []; // только при первом заходе
        }
        state.loadingMore = true;
      })
      .addCase(fetchTickets.fulfilled, (state) => {
        state.status = 'success';
        state.stop = true;
        state.loadingMore = false;
      })
      .addCase(fetchSearchId.fulfilled, (state, action) => {
        state.searchId = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      });
  },
});

export const { addTickets, setFilters, addTicketsPart } = ticketSlice.actions;

export const selectTickets = (state) => state.tickets;
export const selectTicketsFilters = (state) => state.tickets.filters;

export default ticketSlice.reducer;
