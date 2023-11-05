// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import roster from 'src/store/apps/roster'
import leaves from 'src/store/apps/leaves'

export const store = configureStore({
    reducer: {
        roster,
        leaves,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false
        })
})
