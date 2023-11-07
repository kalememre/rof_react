import React, { Fragment, useContext } from 'react'

// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'
import Calendar from 'src/views/apps/leaves/Calendar'
import { getHolidays } from 'src/store/apps/holidays'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { getBranches, getRoles } from 'src/store/apps/user'
import { useTheme } from '@mui/material/styles'
import RoleListAccordion from 'src/views/apps/leaves/RoleListAccordion'
import DialogHolidayDetail from 'src/views/apps/leaves/DialogHolidayDetail'
import { useMediaQuery } from '@mui/material'
import SidebarLeft from 'src/views/apps/leaves/SidebarLeft'

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
    const { roles, branches, isLoading } = useSelector(state => state.user)

    // ** Hooks
    const ability = useContext(AbilityContext)
    const userAbility = ability.can(true, 'can_see_branch_leaves')

    // ** States
    const [calendarApi, setCalendarApi] = useState(null)

    // ** Hooks
    const { settings } = useSettings()
    const dispatch = useDispatch()
    const storeHolidays = useSelector(state => state.storeHolidays)

    // ** Vars
    const leftSidebarWidth = 300
    const addEventSidebarWidth = 400
    const { skin, direction } = settings
    const mdAbove = useMediaQuery(theme => theme.breakpoints.up('md'))
    useEffect(() => {
        !userAbility ? dispatch(getHolidays()) : dispatch(getBranches())
    }, [userAbility, dispatch])

    const selectBranch = (e) => {
        dispatch(getHolidays(e.target.value))
    }

    return (
        <Fragment>
            <CalendarWrapper
                className='app-calendar'
                sx={{
                    boxShadow: skin === 'bordered' ? 0 : 6,
                    ...(skin === 'bordered' && { border: theme => `1px solid ${theme.palette.divider}` })
                }}
            >
                {userAbility &&
                    <SidebarLeft
                        storeHolidays={storeHolidays}
                        mdAbove={mdAbove}
                        dispatch={dispatch}
                        calendarApi={calendarApi}
                        calendarsColor={calendarsColor}
                        branches={branches}
                        selectBranch={selectBranch}
                        isLoading={isLoading}
                        roles={roles}

                    // leftSidebarOpen={leftSidebarOpen}
                    // leftSidebarWidth={leftSidebarWidth}
                    // handleSelectEvent={handleSelectEvent}
                    // handleAllCalendars={handleAllCalendars}
                    // handleCalendarsUpdate={handleCalendarsUpdate}
                    // handleLeftSidebarToggle={handleLeftSidebarToggle}
                    // handleAddEventSidebarToggle={handleAddEventSidebarToggle}
                    />
                }
                <Box
                    sx={{
                        p: 6,
                        pb: 0,
                        flexGrow: 1,
                        borderRadius: 1,
                        boxShadow: 'none',
                        backgroundColor: 'background.paper',
                        ...(userAbility && mdAbove ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } : {})

                    }}
                >
                    <Calendar
                        storeHolidays={storeHolidays}
                        dispatch={dispatch}
                        direction={direction}
                        calendarApi={calendarApi}
                        calendarsColor={calendarsColor}
                        setCalendarApi={setCalendarApi}
                        userAbility={userAbility}
                    />
                </Box>
            </CalendarWrapper>
        </Fragment>
    )
}
LeavesPage.acl = {
    action: true,
    subject: 'can_access_leave_page'
}

export default LeavesPage