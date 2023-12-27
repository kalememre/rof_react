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

// ** FullCalendar & App Components Imports
import Calendar from 'src/views/apps/roster/Calendar'
import SidebarLeft from 'src/views/apps/roster/SidebarLeft'
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'
import AddEventSidebar from 'src/views/apps/roster/AddEventSidebar'

// ** Actions
import {
    addEvent,
    fetchEvents,
    deleteEvent,
    updateEvent,
    handleSelectEvent,
    handleAllCalendars,
    handleCalendarsUpdate
} from 'src/store/apps/roster'

// ** CalendarColors
const calendarsColor = {
    Personal: 'error',
    Business: 'primary',
    Family: 'warning',
    Holiday: 'success',
    ETC: 'info'
}

const RosterPage = () => {
    // ** States
    const [calendarApi, setCalendarApi] = useState(null)
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
    const [addEventSidebarOpen, setAddEventSidebarOpen] = useState(false)

    // ** Hooks
    const { settings } = useSettings()
    const dispatch = useDispatch()
    const store = useSelector(state => state.roster)

    // ** Vars
    const { skin, direction } = settings
    useEffect(() => {
        // dispatch(fetchEvents(store.selectedCalendars))
    }, [dispatch, store.selectedCalendars])
    const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)
    const handleAddEventSidebarToggle = () => setAddEventSidebarOpen(!addEventSidebarOpen)

    return (
        <CalendarWrapper
            className='app-calendar'
            sx={{
                boxShadow: skin === 'bordered' ? 0 : 6,
                ...(skin === 'bordered' && { border: theme => `1px solid ${theme.palette.divider}` })
            }}
        >
            {/* <SidebarLeft
                store={store}

                // mdAbove={mdAbove}
                dispatch={dispatch}
                calendarApi={calendarApi}
                calendarsColor={calendarsColor}
                leftSidebarOpen={true}

                // leftSidebarWidth={leftSidebarWidth}
                handleSelectEvent={handleSelectEvent}
                handleAllCalendars={handleAllCalendars}
                handleCalendarsUpdate={handleCalendarsUpdate}
                handleLeftSidebarToggle={handleLeftSidebarToggle}
                handleAddEventSidebarToggle={handleAddEventSidebarToggle}
            /> */}
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
                    updateEvent={updateEvent}
                    calendarApi={calendarApi}
                    calendarsColor={calendarsColor}
                    setCalendarApi={setCalendarApi}
                    handleSelectEvent={handleSelectEvent}
                    handleLeftSidebarToggle={handleLeftSidebarToggle}
                    handleAddEventSidebarToggle={handleAddEventSidebarToggle}
                />
            </Box>
        </CalendarWrapper>
    )
}
RosterPage.acl = {
    action: true,
    subject: 'can_access_roster_page'
}


export default RosterPage