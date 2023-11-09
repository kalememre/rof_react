// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

import toast from 'react-hot-toast'


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


export const appUserSlice = createSlice({
    name: 'appUser',
    initialState: {
        users: [],
        branches: [],
        roles: [],
        error: null,
        userLoading: false,
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getBranches.pending, (state, action) => {
            state.userLoading = true
        })
        builder.addCase(getBranches.fulfilled, (state, action) => {
            state.branches = action.payload
            toast.success('Successfully loaded branches')
            state.userLoading = false
        })
        builder.addCase(getBranches.rejected, (state, action) => {
            state.error = action.error.message
            toast.error('Failed to load branches')
            state.userLoading = false
        })
        builder.addCase(getRoles.pending, (state, action) => {
            state.userLoading = true
        })
        builder.addCase(getRoles.fulfilled, (state, action) => {
            state.roles = action.payload
            toast.success('Successfully loaded roles')
            state.userLoading = false
        })
        builder.addCase(getRoles.rejected, (state, action) => {
            state.error = action.error.message
            toast.error('Failed to load roles')
            state.userLoading = false
        })
    }
})

export default appUserSlice.reducer
