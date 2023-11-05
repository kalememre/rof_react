// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'


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
        error: null,
        isLoading: false,
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getLeaves.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(getLeaves.fulfilled, (state, action) => {
            state.leaves = action.payload
            state.isLoading = false
        })
        builder.addCase(getLeaves.rejected, (state, action) => {
            state.error = action.error.message
            state.isLoading = false
        })
    }
})

export default appLeavesSlice.reducer
