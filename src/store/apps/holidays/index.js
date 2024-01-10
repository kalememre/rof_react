// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

import toast from 'react-hot-toast'
import axiosInstance from 'src/store/axiosDefaults'
import { HolidayStatusEnum } from 'src/views/apps/holidays/HolidayEnum'


// ** Get Holidays
export const getHolidays = createAsyncThunk('appHolidays/getHolidays', async () => {
    const response = await axiosInstance.get('/holiday/user/')

    return response.data
})

// ** Get Branch Holidays
export const getBranchHolidays = createAsyncThunk('appHolidays/getBranchHolidays', async (branch) => {
    try {
        const response = await axiosInstance.get(`/holiday/branch/${branch}/`)

        return response.data
    }
    catch (error) {
        throw error.response.data
    }
})



// ** Add Holidays


// ** Update Holidays
export const patchHoliday = createAsyncThunk('appHolidays/addHolidays', async (holiday) => {
    try {
        const response = await axiosInstance.patch(`/holiday/${holiday.id}/`, holiday)

        return response.data
    }
    catch (error) {
        throw error.response.data
    }
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
            state.holidayLoading = false
        })
        builder.addCase(patchHoliday.pending, (state, action) => {
            state.holidayLoading = true
        })
        builder.addCase(patchHoliday.fulfilled, (state, action) => {
            const holiday = action.payload
            const holidayIndex = state.filteredHolidays.findIndex(h => h.id === holiday.id)
            if (holiday.extendedProps.status === HolidayStatusEnum.APPROVED) {
                state.filteredHolidays[holidayIndex] = holiday
            } else {
                state.filteredHolidays.splice(holidayIndex, 1)
            }
            state.selectedColors = state.filteredHolidays.map(holidays => holidays.color)
            state.holidays = state.filteredHolidays
            state.holidayLoading = false
        })
        builder.addCase(patchHoliday.rejected, (state, action) => {
            state.error = action.error.message
            toast.error(action.error.message)
            state.holidayLoading = false
        })
        builder.addCase(getBranchHolidays.pending, (state, action) => {
            state.holidayLoading = true
        })
        builder.addCase(getBranchHolidays.fulfilled, (state, action) => {
            state.holidays = action.payload
            state.filteredHolidays = action.payload
            toast.success('Successfully loaded holidays')
            state.holidayLoading = false
            state.selectedColors = action.payload.map(holidays => holidays.color)
        })
        builder.addCase(getBranchHolidays.rejected, (state, action) => {
            state.error = action.error.message
            state.holidayLoading = false
        })
    }
})

export const { toggleColor } = appHolidaysSlice.actions

export default appHolidaysSlice.reducer
