// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import roster from 'src/store/apps/roster'
import storeHolidays from 'src/store/apps/holidays'
import storeUsers from 'src/store/apps/user'
import storeBranches from 'src/store/apps/branch'
import storePositions from 'src/store/apps/position'
import storePermissions from 'src/store/apps/permissions'
import storeAnnouncements from 'src/store/apps/announcements'
import storeRoster from 'src/store/apps/roster'

export const store = configureStore({
    reducer: {
        storeRoster,
        storeHolidays,
        storeUsers,
        storeBranches,
        storePositions,
        storePermissions,
        storeAnnouncements
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false
        })
})
