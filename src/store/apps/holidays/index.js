// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

import toast from 'react-hot-toast'
import axiosInstance from 'src/store/axiosDefaults'


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
export const patchHoliday = createAsyncThunk('appHolidays/addHolidays', async ({ id, process, processed_reason }) => {
    console.log(id, process, processed_reason);
    const response = await axiosInstance.patch(`/holidays/${id}/`, { process, processed_reason })

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
            state.holidayLoading = false
        })
        builder.addCase(patchHoliday.pending, (state, action) => {
            state.holidayLoading = true
        })
        builder.addCase(patchHoliday.fulfilled, (state, action) => {
            const holiday = action.payload
            const holidayStatus = holiday.extendedProps.status
            if (holidayStatus === 'refused') {
                const index = state.holidays.findIndex(holidays => holidays.id === holiday.id)
                state.holidays.splice(index, 1)
                state.filteredHolidays.splice(index, 1)
                toast.success('Successfully refused  holiday')
                state.holidayLoading = false
            } else if (holidayStatus === 'approved') {
                const index = state.holidays.findIndex(holidays => holidays.id === holiday.id)
                state.holidays[index] = holiday
                state.filteredHolidays[index] = holiday
                toast.success('Successfully approved holiday')
                state.holidayLoading = false
            }
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
