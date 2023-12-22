// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

import toast from 'react-hot-toast'
import axiosInstance from 'src/store/axiosDefaults'

// ** Get all Users
export const getUsers = createAsyncThunk('appUser/getUsers', async () => {
    try {
        const response = await axiosInstance.get('/user/')

        return response.data
    } catch (error) {
        throw error.response.data
    }
})

// ** Get User by ID
export const getUserById = createAsyncThunk('appUser/getUserById', async (id) => {
    try {
        const response = await axiosInstance.get(`/user/${id}/`)

        return response.data
    } catch (error) {
        throw error.response.data
    }
})

// ** Add new User
export const addUser = createAsyncThunk('appUser/addUser', async (user) => {
    try {
        const response = await axiosInstance.post('/user/', user)

        return response.data
    } catch (error) {
        throw error.response.data
    }
})

// ** Suspended User
export const suspendUser = createAsyncThunk('appUser/suspendUser', async (id) => {
    try {
        const response = await axiosInstance.put(`/user/suspend/${id}`)

        return response.data
    } catch (error) {
        throw error.response.data
    }
})

// ** Update User
export const updateUser = createAsyncThunk('appUser/updateUser', async (user) => {
    try {
        const response = await axiosInstance.put(`/user/${user.id}/`, user)

        return response.data
    } catch (error) {
        throw error.response.data
    }
})

// ** Update User Profile
export const updateUserProfile = createAsyncThunk('appUser/updateUserProfile', async (user) => {
    try {
        const response = await axiosInstance.put(`/user/profile/${user.id}/`, user)

        return response.data
    } catch (error) {
        throw error.response.data
    }
})

// ** Update User Branches
export const updateUserBranches = createAsyncThunk('appUser/updateUserBranches', async (data) => {
    try {
        const response = await axiosInstance.put(`/user/branches/${data.id}/`, data.branches)

        return response.data
    } catch (error) {
        throw error.response.data
    }
})


export const appUserSlice = createSlice({
    name: 'appUser',
    initialState: {
        users: [],
        user: {},
        error: null,
        userLoading: false,
        userProfileLoading: false,
        userBranchesLoading: false
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getUsers.pending, (state, action) => {
            state.userLoading = true
        })
        builder.addCase(getUsers.fulfilled, (state, action) => {
            state.users = action.payload
            state.userLoading = false
        })
        builder.addCase(getUsers.rejected, (state, action) => {
            state.error = action.payload
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
            state.userLoading = false
        })
        builder.addCase(getUserById.pending, (state, action) => {
            state.userLoading = true
        })
        builder.addCase(getUserById.fulfilled, (state, action) => {
            state.user = action.payload
            state.userLoading = false
        })
        builder.addCase(getUserById.rejected, (state, action) => {
            state.error = action.payload
            state.userLoading = false
        })
        builder.addCase(suspendUser.pending, (state, action) => {
            state.userLoading = true
            state.userProfileLoading = true
            state.userBranchesLoading = true
        })
        builder.addCase(suspendUser.fulfilled, (state, action) => {
            const index = state.users.findIndex(user => user.id === action.payload.id)
            state.users[index] = action.payload
            state.user = action.payload
            toast.success('User suspended successfully')
            state.userLoading = false
            state.userProfileLoading = false
            state.userBranchesLoading = false
        })
        builder.addCase(suspendUser.rejected, (state, action) => {
            state.error = action.payload
            state.userLoading = false
            state.userProfileLoading = false
            state.userBranchesLoading = false
        })
        builder.addCase(updateUser.pending, (state, action) => {
            state.userLoading = true
        })
        builder.addCase(updateUser.fulfilled, (state, action) => {
            const index = state.users.findIndex(user => user.id === action.payload.id)
            state.users[index] = action.payload
            state.user = action.payload
            toast.success('User updated successfully')
            state.userLoading = false
        })
        builder.addCase(updateUser.rejected, (state, action) => {
            state.error = action.payload
            state.userLoading = false
        })
        builder.addCase(updateUserProfile.pending, (state, action) => {
            state.userProfileLoading = true
        })
        builder.addCase(updateUserProfile.fulfilled, (state, action) => {
            const index = state.users.findIndex(user => user.id === action.payload.id)
            state.users[index] = action.payload
            state.user = action.payload
            toast.success('User profile updated successfully')
            state.userProfileLoading = false
        })
        builder.addCase(updateUserProfile.rejected, (state, action) => {
            state.error = action.payload
            state.userProfileLoading = false
        })
        builder.addCase(updateUserBranches.pending, (state, action) => {
            state.userBranchesLoading = true
        })
        builder.addCase(updateUserBranches.fulfilled, (state, action) => {
            const index = state.users.findIndex(user => user.id === action.payload.id)
            state.users[index] = action.payload
            state.user = action.payload
            toast.success('User branches updated successfully')
            state.userBranchesLoading = false
        })
        builder.addCase(updateUserBranches.rejected, (state, action) => {
            state.error = action.payload
            state.userBranchesLoading = false
        })
    }
})

export default appUserSlice.reducer
