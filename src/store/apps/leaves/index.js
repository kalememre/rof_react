// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Config
import authConfig from 'src/configs/auth'

// ** Axios Imports
import axios from 'axios'


// ** Get Leaves
export const getLeaves = createAsyncThunk('appLeaves/getLeaves', async () => {
    const response = await axios.get('/leaves/')

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
        })
        builder.addCase(getLeaves.rejected, (state, action) => {
            state.error = action.error.message
        })
    }
})

export default appLeavesSlice.reducer
