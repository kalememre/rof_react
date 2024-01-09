// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import toast from 'react-hot-toast'
import axiosInstance from 'src/store/axiosDefaults'

// ** Get Shifts
export const getShifts = createAsyncThunk('appRoster/getShifts', async (data) => {
  console.log('data', data);
  try {
    const response = await axiosInstance.get(`/roster/${data.branchId}`,
      {
        params:
        {
          startDate: data.startDate,
          endDate: data.endDate
        }
      })

    return response.data
  } catch (error) {
    throw error.response.data
  }
})

// ** Update Shift
export const updateShift = createAsyncThunk('appRoster/updateShift', async (data) => {
  try {
    const response = await axiosInstance.put(`/roster/${data.id}`, data)

    return response.data
  } catch (error) {
    throw error.response.data
  }
})

// ** Publish Roaster
export const publishRoster = createAsyncThunk('appRoster/publishRoster', async (data) => {
  try {
    const response = await axiosInstance.put(`/roster/publish`, data)

    return response.data
  } catch (error) {
    throw error.response.data
  }
})

// ** Add Shift
export const addShift = createAsyncThunk('appRoster/addShift', async (data) => {
  try {
    const response = await axiosInstance.post(`/roster`, data)

    return response.data
  } catch (error) {
    throw error.response.data
  }
})

export const appRoseterSlice = createSlice({
  name: 'appRoster',
  initialState: {
    roster: {},
    shifts: [],
    error: null,
    shiftLoading: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getShifts.pending, (state) => {
        state.shiftLoading = true
      })
      .addCase(getShifts.fulfilled, (state, action) => {
        state.shiftLoading = false
        state.shifts = action.payload
      })
      .addCase(getShifts.rejected, (state, action) => {
        state.shiftLoading = false
        state.error = action.payload
      })
      .addCase(updateShift.pending, (state) => {
        state.shiftLoading = true
      })
      .addCase(updateShift.fulfilled, (state, action) => {
        const index = state.shifts.findIndex(shift => shift.id === action.payload.id)
        state.shifts[index] = action.payload
        state.shiftLoading = false
        toast.success('Shift updated successfully')
      })
      .addCase(updateShift.rejected, (state, action) => {
        state.shiftLoading = false
        state.error = action.payload
      })
      .addCase(publishRoster.pending, (state) => {
        state.shiftLoading = true
      })
      .addCase(publishRoster.fulfilled, (state, action) => {
        state.shiftLoading = false
        state.shifts = action.payload
        toast.success('Roster published successfully')
      })
      .addCase(publishRoster.rejected, (state, action) => {
        state.shiftLoading = false
        state.error = action.payload
      })
      .addCase(addShift.pending, (state) => {
        state.shiftLoading = true
      })
      .addCase(addShift.fulfilled, (state, action) => {
        state.shiftLoading = false
        state.shifts.push(...action.payload)
        toast.success('Shift added successfully')
      })
      .addCase(addShift.rejected, (state, action) => {
        state.shiftLoading = false
        state.error = action.payload
      })

  }
})

export default appRoseterSlice.reducer