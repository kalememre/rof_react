// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import toast from 'react-hot-toast'
import axiosInstance from 'src/store/axiosDefaults'

// ** Get Positions
export const getPositions = createAsyncThunk('appUser/getPositions', async () => {
    try {
        const response = await axiosInstance.get('/position/')

        return response.data
    } catch (error) {
        throw error.response.data
    }
})

// ** Add Position
export const addPosition = createAsyncThunk('appUser/addPosition', async (role) => {
    try {
        const response = await axiosInstance.post('/position/', role)

        return response.data
    } catch (error) {
        throw error.response.data
    }

})

// ** Update Position
export const updatePosition = createAsyncThunk('appUser/updatePosition', async (role) => {
    try {
        const response = await axiosInstance.put(`/position/${role.id}/`, role)

        return response.data
    } catch (error) {
        throw error.response.data
    }
})

// ** Delete Position
export const deletePosition = createAsyncThunk('appUser/deletePosition', async (role) => {
    try {
        await axiosInstance.delete(`/position/${role}/`)

        return role
    } catch (error) {
        throw error.response.data
    }
})

export const appPositionSlice = createSlice({
    name: 'appPosition',
    initialState: {
        positions: [],
        error: null,
        positionLoading: false,
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getPositions.pending, (state, action) => {
            state.positionLoading = true
        })
        builder.addCase(getPositions.fulfilled, (state, action) => {
            state.positions = action.payload
            state.positionLoading = false
        })
        builder.addCase(getPositions.rejected, (state, action) => {
            state.error = action.error.message
            toast.error(`Failed to load positions\n\n"${action.error.message}"`)
            state.positionLoading = false
        })
        builder.addCase(addPosition.pending, (state, action) => {
            state.positionLoading = true
        })
        builder.addCase(addPosition.fulfilled, (state, action) => {
            const newPosition = action.payload
            state.positions.push(newPosition)
            toast.success('Successfully added role')
            state.positionLoading = false
        })
        builder.addCase(addPosition.rejected, (state, action) => {
            state.error = action.error.message
            toast.error(`Failed to add role\n\n"${action.error.message}"`)
            state.positionLoading = false
        })
        builder.addCase(updatePosition.pending, (state, action) => {
            state.positionLoading = true
        })
        builder.addCase(updatePosition.fulfilled, (state, action) => {
            const updatedPosition = action.payload
            const index = state.positions.findIndex(role => role.id === updatedPosition.id)
            state.positions[index] = updatedPosition
            toast.success('Successfully updated role')
            state.positionLoading = false
        })
        builder.addCase(updatePosition.rejected, (state, action) => {
            state.error = action.error.message
            toast.error(`Failed to update role\n\n"${action.error.message}"`)
            state.positionLoading = false
        })
        builder.addCase(deletePosition.pending, (state, action) => {
            state.positionLoading = true
        })
        builder.addCase(deletePosition.fulfilled, (state, action) => {
            const deletedPosition = action.payload
            state.positions = state.positions.filter(role => role.id !== deletedPosition)
            toast.success('Successfully deleted role')
            state.positionLoading = false
        })
        builder.addCase(deletePosition.rejected, (state, action) => {
            state.error = action.error.message
            toast.error(`Failed to delete role\n\n"${action.error.message}"`)
            state.positionLoading = false
        })
    }
})

export default appPositionSlice.reducer