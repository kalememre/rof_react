// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

import toast from 'react-hot-toast'


// ** Get Leaves
export const getLeaves = createAsyncThunk('appLeaves/getLeaves', async (branch) => {
    const response = await axios.get('/leaves/', {
        params: {
            branch: branch
        }
    })

    return response.data
})

// ** Add Leaves


// ** Update Leaves


// ** Delete Leaves


export const appLeavesSlice = createSlice({
    name: 'appLeaves',
    initialState: {
        leaves: [],
        filteredLeaves: [],
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

            state.filteredLeaves = state.leaves.filter(leave => updatedColors.includes(leave.color))
        }
    },
    extraReducers: builder => {
        builder.addCase(getLeaves.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(getLeaves.fulfilled, (state, action) => {
            state.leaves = action.payload
            state.filteredLeaves = action.payload
            toast.success('Successfully loaded holidays')
            state.isLoading = false
            state.selectedColors = action.payload.map(leave => leave.color)
        })
        builder.addCase(getLeaves.rejected, (state, action) => {
            state.error = action.error.message
            toast.error('Failed to load holidays')
            state.isLoading = false
        })
    }
})

export const { toggleColor } = appLeavesSlice.actions

export default appLeavesSlice.reducer
