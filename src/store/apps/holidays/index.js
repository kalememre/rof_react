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
export const patchHoliday = createAsyncThunk('appHolidays/addHolidays', async (holiday) => {
    const response = await axios.patch(`/holidays/${holiday}/`)

    return response.data
})

// ** Delete Holidays


export const appHolidaysSlice = createSlice({
    name: 'appHolidays',
    initialState: {
        holidays: [],
        filteredHolidays: [],
        selectedColors: [],
        error: null,
        holidayLoading: false,
    },
    reducers: {
        toggleColor: (state, action) => {
            const color = action.payload;

            const updatedColors = state.selectedColors.includes(color)
                ? state.selectedColors.filter(c => c !== color)
                : [...state.selectedColors, color];
            state.selectedColors = updatedColors;

            state.filteredHolidays = state.holidays.filter(holidays => updatedColors.includes(holidays.color))
        },
    },
    extraReducers: builder => {
        builder.addCase(getHolidays.pending, (state, action) => {
            state.holidayLoading = true
        })
        builder.addCase(getHolidays.fulfilled, (state, action) => {
            state.holidays = action.payload
            state.filteredHolidays = action.payload
            toast.success('Successfully loaded holidays')
            state.holidayLoading = false
            state.selectedColors = action.payload.map(holidays => holidays.color)
        })
        builder.addCase(getHolidays.rejected, (state, action) => {
            state.error = action.error.message
            toast.error('Failed to load holidays')
            state.holidayLoading = false
        })
        builder.addCase(patchHoliday.pending, (state, action) => {
            state.holidayLoading = true
        })
        builder.addCase(patchHoliday.fulfilled, (state, action) => {
            const holiday = action.payload
            const index = state.holidays.findIndex(holidays => holidays.id === holiday.id)
            state.holidays[index] = holiday
            state.filteredHolidays[index] = holiday
            toast.success('Successfully updated holiday')
            state.holidayLoading = false
        })
        builder.addCase(patchHoliday.rejected, (state, action) => {
            state.error = action.error.message
            toast.error(action.error.message)
            state.holidayLoading = false
        })
    }
})

export const { toggleColor } = appHolidaysSlice.actions

export default appHolidaysSlice.reducer
