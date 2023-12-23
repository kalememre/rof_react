// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import toast from 'react-hot-toast'
import axiosInstance from 'src/store/axiosDefaults'

// ** Get Announcements
export const getAnnouncements = createAsyncThunk('appUser/getAnnouncements', async () => {
    try {
        const response = await axiosInstance.get('/announcement/')

        return response.data
    } catch (error) {
        throw error.response.data
    }
})

// ** Add Announcement
export const addAnnouncement = createAsyncThunk('appUser/addAnnouncement', async (announcement) => {
    try {
        const response = await axiosInstance.post('/announcement/', announcement)

        return response.data
    } catch (error) {
        throw error.response.data
    }
})

// ** Get Announcements For User
export const getAnnouncementsForUser = createAsyncThunk('appUser/getAnnouncementsForUser', async () => {
    try {
        const response = await axiosInstance.get(`/announcement/user/`)

        return response.data
    } catch (error) {
        throw error.response.data
    }
})

export const appAnnouncementSlice = createSlice({
    name: 'appAnnouncement',
    initialState: {
        announcements: [],
        error: null,
        announcementLoading: false,
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getAnnouncements.pending, (state) => {
            state.announcementLoading = true
        })
        builder.addCase(getAnnouncements.fulfilled, (state, action) => {
            state.announcementLoading = false
            state.announcements = action.payload
        })
        builder.addCase(getAnnouncements.rejected, (state, action) => {
            state.announcementLoading = false
            state.error = action.payload
        })
        builder.addCase(addAnnouncement.pending, (state) => {
            state.announcementLoading = true
        })
        builder.addCase(addAnnouncement.fulfilled, (state, action) => {
            state.announcementLoading = false
            state.announcements.push(action.payload)
            toast.success('Announcement added successfully')
        })
        builder.addCase(addAnnouncement.rejected, (state, action) => {
            state.announcementLoading = false
            state.error = action.payload
            toast.error('Something went wrong')
        })
        builder.addCase(getAnnouncementsForUser.pending, (state) => {
            state.announcementLoading = true
        })
        builder.addCase(getAnnouncementsForUser.fulfilled, (state, action) => {
            state.announcementLoading = false
            state.announcements = action.payload
        })
        builder.addCase(getAnnouncementsForUser.rejected, (state, action) => {
            state.announcementLoading = false
            state.error = action.payload
        })
    }
})

export default appAnnouncementSlice.reducer