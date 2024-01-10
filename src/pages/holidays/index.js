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
import Calendar from 'src/views/apps/holidays/Calendar'
import { getBranchHolidays, getHolidays } from 'src/store/apps/holidays'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { Grid, Typography, useMediaQuery } from '@mui/material'
import SidebarLeft from 'src/views/apps/holidays/SidebarLeft'
import { getBranches } from 'src/store/apps/branch'
import { getPositions } from 'src/store/apps/position'
import { Roles } from 'src/Roles'


const HolidaysPage = () => {

    // ** States
    const storePositions = useSelector(state => state.storePositions)
    const storeBranches = useSelector(state => state.storeBranches)
    const storeHolidays = useSelector(state => state.storeHolidays)

    // ** Hooks
    const ability = useContext(AbilityContext)
    const CAN_VIEW_BRANCH_HOLIDAYS = ability?.can(true, Roles.CAN_VIEW_BRANCH_HOLIDAYS)
    const CAN_APPROVE_BRANCH_HOLIDAYS = ability.can(true, Roles.CAN_APPROVE_BRANCH_HOLIDAYS)

    // ** States
    const [calendarApi, setCalendarApi] = useState(null)

    // ** Hooks
    const { settings } = useSettings()
    const dispatch = useDispatch()

    // ** Vars
    const leftSidebarWidth = 300
    const { skin, direction } = settings
    const mdAbove = useMediaQuery(theme => theme.breakpoints.up('md'))
    const xsAbove = useMediaQuery(theme => theme.breakpoints.down('sm'))
    useEffect(() => {
        dispatch(getBranches())
        dispatch(getPositions())
    }, [dispatch])

    const selectBranch = (e) => {
        if (e.target.value !== 'None') dispatch(getBranchHolidays(e.target.value))
    }

    return (
        <Fragment>
            {xsAbove ? <Typography>Not Support Small Screen</Typography> :

                <CalendarWrapper
                    className='app-calendar'
                    sx={{
                        boxShadow: skin === 'bordered' ? 0 : 6,
                        ...(skin === 'bordered' && { border: theme => `1px solid ${theme.palette.divider}` })
                    }}
                >
                    <SidebarLeft
                        storeHolidays={storeHolidays}
                        mdAbove={mdAbove}
                        dispatch={dispatch}
                        calendarApi={calendarApi}
                        storeBranches={storeBranches}
                        selectBranch={selectBranch}
                        storePositions={storePositions}
                        leftSidebarWidth={leftSidebarWidth}
                        CAN_VIEW_BRANCH_HOLIDAYS={CAN_VIEW_BRANCH_HOLIDAYS}
                    />
                    <Box
                        sx={{
                            p: 6,
                            pb: 0,
                            flexGrow: 1,
                            borderRadius: 1,
                            boxShadow: 'none',
                            backgroundColor: 'background.paper',
                            ...(CAN_VIEW_BRANCH_HOLIDAYS && mdAbove ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } : {})

                        }}
                    >
                        <Calendar
                            storeHolidays={storeHolidays}
                            dispatch={dispatch}
                            direction={direction}
                            calendarApi={calendarApi}
                            setCalendarApi={setCalendarApi}
                            CAN_VIEW_BRANCH_HOLIDAYS={CAN_VIEW_BRANCH_HOLIDAYS}
                            CAN_APPROVE_BRANCH_HOLIDAYS={CAN_APPROVE_BRANCH_HOLIDAYS}
                        />
                    </Box>

                </CalendarWrapper>
            }
        </Fragment>
    )
}

HolidaysPage.acl = {
    action: true,
    subject: Roles.CAN_VIEW_BRANCH_HOLIDAYS
}

export default HolidaysPage