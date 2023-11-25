// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

import toast from 'react-hot-toast'
import axiosInstance from 'src/store/axiosDefaults'




export const appUserSlice = createSlice({
    name: 'appUser',
    initialState: {
        users: [],
        error: null,
        userLoading: false,
    },
    reducers: {},
    extraReducers: builder => {

    }
})

export default appUserSlice.reducer
