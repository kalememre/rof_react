// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import toast from 'react-hot-toast'
import axiosInstance from 'src/store/axiosDefaults'

// ** Get Permissions
export const getPermissions = createAsyncThunk('appPermission/getPermissions', async () => {
    const response = await axiosInstance.get('/role/')

    return response.data
})

// ** Get User Permissions
export const getUserPermissions = createAsyncThunk('appPermission/getUserPermissions', async (userId) => {
    const response = await axiosInstance.get(`/role/user/${userId}/`)

    return response.data
})

// ** Update User Permissions
export const updateUserPermissions = createAsyncThunk('appPermission/updateUserPermissions', async (data) => {
    const response = await axiosInstance.put(`/role/user/${data.userId}/`, data.permissions)

    return response.data
})

export const appPermissionSlice = createSlice({
    name: 'appPermission',
    initialState: {
        permissions: [],
        userPermissions: [],
        error: null,
        permissionLoading: false,
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getPermissions.pending, (state, action) => {
            state.permissionLoading = true
        })
        builder.addCase(getPermissions.fulfilled, (state, action) => {
            state.permissions = action.payload
            toast.success('Successfully loaded permissions')
            state.permissionLoading = false
        })
        builder.addCase(getPermissions.rejected, (state, action) => {
            state.error = action.error.message
            toast.error(`Failed to load permissions\n"${action.error.message}"`)
            state.permissionLoading = false
        })
        builder.addCase(getUserPermissions.pending, (state, action) => {
            state.permissionLoading = true
        })
        builder.addCase(getUserPermissions.fulfilled, (state, action) => {
            state.userPermissions = action.payload
            toast.success('Successfully loaded user permissions')
            state.permissionLoading = false
        })
        builder.addCase(getUserPermissions.rejected, (state, action) => {
            state.error = action.error.message
            toast.error(`Failed to load user permissions\n"${action.error.message}"`)
            state.permissionLoading = false
        })
        builder.addCase(updateUserPermissions.pending, (state, action) => {
            state.permissionLoading = true
        })
        builder.addCase(updateUserPermissions.fulfilled, (state, action) => {
            state.userPermissions = action.payload
            toast.success('Successfully updated user permissions')
            state.permissionLoading = false
        })
        builder.addCase(updateUserPermissions.rejected, (state, action) => {
            state.error = action.error.message
            toast.error(`Failed to update user permissions\n"${action.error.message}"`)
            state.permissionLoading = false
        })
    }
})

export default appPermissionSlice.reducer