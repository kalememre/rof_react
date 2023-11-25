// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import toast from 'react-hot-toast'
import axiosInstance from 'src/store/axiosDefaults'

// ** Get Roles
export const getRoles = createAsyncThunk('appUser/getRoles', async () => {
    const response = await axiosInstance.get('/roles/')

    return response.data
})

// ** Add Role
export const addRole = createAsyncThunk('appUser/addRole', async (role) => {
    const response = await axiosInstance.post('/roles/', role)

    return response.data

})

// ** Update Role
export const updateRole = createAsyncThunk('appUser/updateRole', async (role) => {
    const response = await axiosInstance.patch(`/roles/${role.id}/`, role)

    return response.data
})

// ** Delete Role
export const deleteRole = createAsyncThunk('appUser/deleteRole', async (role) => {
    await axiosInstance.delete(`/roles/${role}/`)

    return role
})

export const appRoleSlice = createSlice({
    name: 'appRole',
    initialState: {
        roles: [],
        error: null,
        roleLoading: false,
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getRoles.pending, (state, action) => {
            state.roleLoading = true
        })
        builder.addCase(getRoles.fulfilled, (state, action) => {
            state.roles = action.payload
            toast.success('Successfully loaded roles')
            state.roleLoading = false
        })
        builder.addCase(getRoles.rejected, (state, action) => {
            state.error = action.error.message
            toast.error(`Failed to load roles\n"${action.error.message}"`)
            state.roleLoading = false
        })
        builder.addCase(addRole.pending, (state, action) => {
            state.roleLoading = true
        })
        builder.addCase(addRole.fulfilled, (state, action) => {
            const newRole = action.payload
            state.roles.push(newRole)
            toast.success('Successfully added role')
            state.roleLoading = false
        })
        builder.addCase(addRole.rejected, (state, action) => {
            state.error = action.error.message
            toast.error(`Failed to add role\n"${action.error.message}"`)
            state.roleLoading = false
        })
        builder.addCase(updateRole.pending, (state, action) => {
            state.roleLoading = true
        })
        builder.addCase(updateRole.fulfilled, (state, action) => {
            const updatedRole = action.payload
            const index = state.roles.findIndex(role => role.id === updatedRole.id)
            state.roles[index] = updatedRole
            toast.success('Successfully updated role')
            state.roleLoading = false
        })
        builder.addCase(updateRole.rejected, (state, action) => {
            state.error = action.error.message
            toast.error(`Failed to update role\n"${action.error.message}"`)
            state.roleLoading = false
        })
        builder.addCase(deleteRole.pending, (state, action) => {
            state.roleLoading = true
        })
        builder.addCase(deleteRole.fulfilled, (state, action) => {
            const deletedRole = action.payload
            state.roles = state.roles.filter(role => role.id !== deletedRole)
            toast.success('Successfully deleted role')
            state.roleLoading = false
        })
        builder.addCase(deleteRole.rejected, (state, action) => {
            state.error = action.error.message
            toast.error(`Failed to delete role\n"${action.error.message}"`)
            state.roleLoading = false
        })
    }
})

export default appRoleSlice.reducer