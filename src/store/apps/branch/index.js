// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import toast from 'react-hot-toast'
import axiosInstance from 'src/store/axiosDefaults'

// ** Get Branches
export const getBranches = createAsyncThunk('appUser/getBranches', async (branch) => {
    const response = await axiosInstance.get('/user/branch/')

    return response.data
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
    }
})

export default appBranchSlice.reducer