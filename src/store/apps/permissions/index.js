// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import toast from 'react-hot-toast'
import axiosInstance from 'src/store/axiosDefaults'

// ** Get Permissions
export const getPermissions = createAsyncThunk('appPermission/getPermissions', async () => {
    const response = await axiosInstance.get('/permissions/')

    return response.data
})

export const appPermissionSlice = createSlice({
    name: 'appPermission',
    initialState: {
        permissions: [],
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
    }
})

export default appPermissionSlice.reducer