// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import toast from 'react-hot-toast'
import axiosInstance from 'src/store/axiosDefaults'

// ** Get Branches
export const getBranches = createAsyncThunk('appUser/getBranches', async (branch) => {
    const response = await axiosInstance.get('/branches/')

    return response.data
})

// ** Add Branch
export const addBranch = createAsyncThunk('appUser/addBranch', async (branch) => {
    const response = await axiosInstance.post('/branches/', branch)

    return response.data
})

// ** Update Branch
export const updateBranch = createAsyncThunk('appUser/updateBranch', async (branch) => {
    const response = await axiosInstance.patch(`/branches/${branch.id}/`, branch)

    return response.data
})

// ** Delete Branch
export const deleteBranch = createAsyncThunk('appUser/deleteBranch', async (branchId) => {
    const response = await axiosInstance.delete(`/branches/${branchId}/`)

    return branchId
})

export const appBranchSlice = createSlice({
    name: 'appBranch',
    initialState: {
        branches: [],
        error: null,
        branchLoading: false,
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getBranches.pending, (state, action) => {
            state.branchLoading = true
        })
        builder.addCase(getBranches.fulfilled, (state, action) => {
            state.branches = action.payload
            toast.success('Successfully loaded branches')
            state.branchLoading = false
        })
        builder.addCase(getBranches.rejected, (state, action) => {
            state.error = action.error.message
            state.branchLoading = false
        })
        builder.addCase(addBranch.pending, (state, action) => {
            state.branchLoading = true
        })
        builder.addCase(addBranch.fulfilled, (state, action) => {
            state.branches.push(action.payload)
            toast.success('Successfully added branch')
            state.branchLoading = false
        })
        builder.addCase(addBranch.rejected, (state, action) => {
            state.error = action.error.message
            toast.error(`Failed to add branch\n"Branch with this name already exists"`)
            state.branchLoading = false
        })
        builder.addCase(updateBranch.pending, (state, action) => {
            state.branchLoading = true
        })
        builder.addCase(updateBranch.fulfilled, (state, action) => {
            const branch = action.payload
            const index = state.branches.findIndex(b => b.id === branch.id)
            state.branches[index] = branch
            toast.success('Successfully updated branch')
            state.branchLoading = false
        })
        builder.addCase(updateBranch.rejected, (state, action) => {
            state.error = action.error.message
            toast.error(`Failed to add branch\n"Branch with this name already exists"`)
            state.branchLoading = false
        })
        builder.addCase(deleteBranch.pending, (state, action) => {
            state.branchLoading = true
        })
        builder.addCase(deleteBranch.fulfilled, (state, action) => {
            const branchId = action.payload
            state.branches = state.branches.filter(b => b.id !== branchId)
            toast.success('Successfully deleted branch')
            state.branchLoading = false
        })
        builder.addCase(deleteBranch.rejected, (state, action) => {
            state.error = action.error.message
            toast.error(`Failed to delete branch\n"${action.error.message}"`)
            state.branchLoading = false
        })
    }
})

export default appBranchSlice.reducer