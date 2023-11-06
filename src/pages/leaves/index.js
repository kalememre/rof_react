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
import { getLeaves } from 'src/store/apps/leaves'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { getBranches, getRoles } from 'src/store/apps/user'
import { useTheme } from '@mui/material/styles'
import RoleListAccordion from 'src/views/apps/leaves/RoleListAccordion'
import CardActionsRefresh from 'src/views/ui/cards/actions/CardActionsRefresh'
import DialogHolidayDetail from 'src/views/apps/leaves/DialogHolidayDetail'

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
    const store = useSelector(state => state.leaves)

    // ** Vars
    const { skin, direction } = settings
    useEffect(() => {
        dispatch(getRoles())
        !userAbility ? dispatch(getLeaves()) : dispatch(getBranches())
    }, [userAbility, dispatch])

    const selectBranch = (e) => {
        dispatch(getLeaves(e.target.value))
    }

    return (
        <Fragment>
            {userAbility && (
                <CardActionsRefresh
                    branches={branches}
                    isLoading={isLoading}
                    store={store}
                    selectBranch={selectBranch}
                />

            )}
            <RoleListAccordion roles={roles} />
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
        </Fragment>
    )
}
LeavesPage.acl = {
    action: true,
    subject: 'can_access_leave_page'
}

export default LeavesPage