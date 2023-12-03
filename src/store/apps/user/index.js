// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

import toast from 'react-hot-toast'
import axiosInstance from 'src/store/axiosDefaults'

// ** Get all Users
export const getUsers = createAsyncThunk('appUser/getUsers', async () => {
    const response = await axiosInstance.get('/user/')

    return response.data
})

// ** Add new User
export const addUser = createAsyncThunk('appUser/addUser', async (user) => {
    const response = await axiosInstance.post('/user/', user)

    return response.data
})


export const appUserSlice = createSlice({
    name: 'appUser',
    initialState: {
        users: [],
        error: null,
        userLoading: false,
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getUsers.pending, (state, action) => {
            state.userLoading = true
        })
        builder.addCase(getUsers.fulfilled, (state, action) => {
            state.users = action.payload
            toast.success('Users loaded successfully')
            state.userLoading = false
        })
        builder.addCase(getUsers.rejected, (state, action) => {
            state.error = action.payload
            toast.error('Something went wrong')
            state.userLoading = false
        })
        builder.addCase(addUser.pending, (state, action) => {
            state.userLoading = true
        })
        builder.addCase(addUser.fulfilled, (state, action) => {
            state.users.push(action.payload)
            toast.success('User added successfully')
            state.userLoading = false
        })
        builder.addCase(addUser.rejected, (state, action) => {
            state.error = action.payload
            toast.error('Something went wrong')
            state.userLoading = false
        })
    }
})

export default appUserSlice.reducer
