// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import roster from 'src/store/apps/roster'
import storeHolidays from 'src/store/apps/holidays'
import storeUsers from 'src/store/apps/user'
import storeBranches from 'src/store/apps/branch'
import storeRoles from 'src/store/apps/role'
import storePermissions from 'src/store/apps/permissions'

export const store = configureStore({
    reducer: {
        roster,
        storeHolidays,
        storeUsers,
        storeBranches,
        storeRoles,
        storePermissions
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false
        })
})
