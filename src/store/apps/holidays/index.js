// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

import toast from 'react-hot-toast'


// ** Get Holidays
export const getHolidays = createAsyncThunk('appHolidays/getHolidays', async (branch) => {
    const response = await axios.get('/holidays/', {
        params: {
            branch: branch
        }
    })

    return response.data
})

// ** Add Holidays


// ** Update Holidays


// ** Delete Holidays


export const appHolidaysSlice = createSlice({
    name: 'appHolidays',
    initialState: {
        holidays: [],
        filteredHolidays: [],
        selectedColors: [],
        error: null,
        isLoading: false,
    },
    reducers: {
        toggleColor: (state, action) => {
            const color = action.payload;

            const updatedColors = state.selectedColors.includes(color)
                ? state.selectedColors.filter(c => c !== color)
                : [...state.selectedColors, color];
            state.selectedColors = updatedColors;

            state.filteredHolidays = state.holidays.filter(holidays => updatedColors.includes(holidays.color))
        }
    },
    extraReducers: builder => {
        builder.addCase(getHolidays.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(getHolidays.fulfilled, (state, action) => {
            state.holidays = action.payload
            state.filteredHolidays = action.payload
            toast.success('Successfully loaded holidays')
            state.isLoading = false
            state.selectedColors = action.payload.map(holidays => holidays.color)
        })
        builder.addCase(getHolidays.rejected, (state, action) => {
            state.error = action.error.message
            toast.error('Failed to load holidays')
            state.isLoading = false
        })
    }
})

export const { toggleColor } = appHolidaysSlice.actions

export default appHolidaysSlice.reducer
