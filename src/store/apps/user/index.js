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

// ** Get Roles
export const getRoles = createAsyncThunk('appUser/getRoles', async () => {
    const response = await axios.get('/roles/')

    return response.data
})

// ** Add Role
export const addRole = createAsyncThunk('appUser/addRole', async (role) => {
    const response = await axios.post('/roles/', role)

    return response.data
})

// ** Update Role
export const updateRole = createAsyncThunk('appUser/updateRole', async (role) => {
    const response = await axios.patch(`/roles/${role.id}/`, role)

    return response.data
})

// ** Delete Role
export const deleteRole = createAsyncThunk('appUser/deleteRole', async (role) => {
    try {
        await axios.delete(`/roles/${role}/`)

        return role
    } catch (error) {
        throw Error(error.response.data.error.message)
    }
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
        builder.addCase(addRole.pending, (state, action) => {
            state.userLoading = true
        })
        builder.addCase(addRole.fulfilled, (state, action) => {
            const newRole = action.payload
            state.roles.push(newRole)
            toast.success('Successfully added role')
            state.userLoading = false
        })
        builder.addCase(addRole.rejected, (state, action) => {
            state.error = action.error.message
            toast.error('Failed to add role')
            state.userLoading = false
        })
        builder.addCase(updateRole.pending, (state, action) => {
            state.userLoading = true
        })
        builder.addCase(updateRole.fulfilled, (state, action) => {
            const updatedRole = action.payload
            const index = state.roles.findIndex(role => role.id === updatedRole.id)
            state.roles[index] = updatedRole
            toast.success('Successfully updated role')
            state.userLoading = false
        })
        builder.addCase(updateRole.rejected, (state, action) => {
            state.error = action.error.message
            toast.error('Failed to update role')
            state.userLoading = false
        })
        builder.addCase(deleteRole.pending, (state, action) => {
            state.userLoading = true
        })
        builder.addCase(deleteRole.fulfilled, (state, action) => {
            const deletedRole = action.payload
            state.roles = state.roles.filter(role => role.id !== deletedRole)
            toast.success('Successfully deleted role')
            state.userLoading = false
        })
        builder.addCase(deleteRole.rejected, (state, action) => {
            state.error = action.error.message
            toast.error(`Failed to delete role\n"${action.error.message}"`)
            state.userLoading = false
        })
    }
})

export default appUserSlice.reducer
