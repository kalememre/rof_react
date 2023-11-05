// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'


// ** Get Branches
export const getBranches = createAsyncThunk('appUser/getBranches', async (branch) => {
    const response = await axios.get('/user/branch/')

    return response.data
})

// ** Get Branches
export const getRoles = createAsyncThunk('appUser/getRoles', async (branch) => {
    const response = await axios.get('/roles/')

    return response.data
})

// ** Add Leaves


// ** Update Leaves


// ** Delete Leaves


export const appUserSlice = createSlice({
    name: 'appUser',
    initialState: {
        branches: [],
        roles: [],
        error: null,
        isLoading: false,
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getBranches.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(getBranches.fulfilled, (state, action) => {
            state.branches = action.payload
            state.isLoading = false
        })
        builder.addCase(getBranches.rejected, (state, action) => {
            state.error = action.error.message
            state.isLoading = false
        })
        builder.addCase(getRoles.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(getRoles.fulfilled, (state, action) => {
            state.roles = action.payload
            state.isLoading = false
        })
        builder.addCase(getRoles.rejected, (state, action) => {
            state.error = action.error.message
            state.isLoading = false
        })
    }
})

export default appUserSlice.reducer
