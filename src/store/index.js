// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import roster from 'src/store/apps/roster'
import storeHolidays from 'src/store/apps/holidays'
import user from 'src/store/apps/user'

export const store = configureStore({
    reducer: {
        roster,
        storeHolidays,
        user,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false
        })
})
