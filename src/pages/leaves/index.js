import React from 'react'

// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'
import Calendar from 'src/views/apps/leaves/Calendar'
import { getLeaves } from 'src/store/apps/leaves'

// ** CalendarColors
const calendarsColor = {
    Personal: 'error',
    Business: 'primary',
    Family: 'warning',
    Holiday: 'success',
    ETC: 'info'
}

const LeavesPage = () => {
    // ** States
    const [calendarApi, setCalendarApi] = useState(null)

    // ** Hooks
    const { settings } = useSettings()
    const dispatch = useDispatch()
    const store = useSelector(state => state.leaves)

    // ** Vars
    const { skin, direction } = settings
    useEffect(() => {
        dispatch(getLeaves())
    }, [dispatch])

    return (
        <CalendarWrapper
            className='app-calendar'
            sx={{
                boxShadow: skin === 'bordered' ? 0 : 6,
                ...(skin === 'bordered' && { border: theme => `1px solid ${theme.palette.divider}` })
            }}
        >
            <Box
                sx={{
                    p: 6,
                    pb: 0,
                    flexGrow: 1,
                    borderRadius: 1,
                    boxShadow: 'none',
                    backgroundColor: 'background.paper',
                }}
            >
                <Calendar
                    store={store}
                    dispatch={dispatch}
                    direction={direction}
                    calendarApi={calendarApi}
                    calendarsColor={calendarsColor}
                    setCalendarApi={setCalendarApi}
                />
            </Box>
        </CalendarWrapper>
    )
}
LeavesPage.acl = {
    action: true,
    subject: 'can_access_leave_page'
}

export default LeavesPage