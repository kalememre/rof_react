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
import { getHolidays } from 'src/store/apps/holidays'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { Typography, useMediaQuery } from '@mui/material'
import SidebarLeft from 'src/views/apps/holidays/SidebarLeft'
import { getBranches } from 'src/store/apps/branch'
import { getRoles } from 'src/store/apps/role'


const HolidaysPage = () => {

    // ** States
    const storeRoles = useSelector(state => state.storeRoles)
    const storeBranches = useSelector(state => state.storeBranches)
    const storeHolidays = useSelector(state => state.storeHolidays)

    // ** Hooks
    const ability = useContext(AbilityContext)
    const can_see_branch_holidays = ability?.can(true, 'can_see_branch_holidays')
    const can_approve_holidays = ability.can(true, 'can_approve_holidays')

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
        if (!can_see_branch_holidays) {
            dispatch(getHolidays())
        } else {
            dispatch(getBranches())
            dispatch(getRoles())
        }
    }, [can_see_branch_holidays, dispatch])

    const selectBranch = (e) => {
        if (e.target.value !== 'None') dispatch(getHolidays(e.target.value))
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
                    {can_see_branch_holidays &&
                        <SidebarLeft
                            storeHolidays={storeHolidays}
                            mdAbove={mdAbove}
                            dispatch={dispatch}
                            calendarApi={calendarApi}
                            storeBranches={storeBranches}
                            selectBranch={selectBranch}
                            storeRoles={storeRoles}
                            leftSidebarWidth={leftSidebarWidth}
                            can_see_branch_holidays={can_see_branch_holidays}
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
                            ...(can_see_branch_holidays && mdAbove ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } : {})

                        }}
                    >
                        <Calendar
                            storeHolidays={storeHolidays}
                            dispatch={dispatch}
                            direction={direction}
                            calendarApi={calendarApi}
                            setCalendarApi={setCalendarApi}
                            can_see_branch_holidays={can_see_branch_holidays}
                            can_approve_holidays={can_approve_holidays}
                        />
                    </Box>

                </CalendarWrapper>
            }
        </Fragment>
    )
}

HolidaysPage.acl = {
    action: true,
    subject: 'can_create_user'
}

export default HolidaysPage