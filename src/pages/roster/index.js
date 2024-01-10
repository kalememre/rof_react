import React, { useContext, useRef } from 'react'

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
import moment from 'moment';

// ** Actions
import {
    addEvent,
    fetchEvents,
    deleteEvent,
    updateEvent,
    handleSelectEvent,
    handleAllCalendars,
    handleCalendarsUpdate,
    getShifts
} from 'src/store/apps/roster'
import { Button, Card, CardContent, CardHeader, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { getBranches } from 'src/store/apps/branch'
import PageHeader from 'src/@core/components/page-header'
import Link from 'next/link'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import toast from 'react-hot-toast'
import { Roles } from 'src/Roles'

// ** CalendarColors
const calendarsColor = {
    Personal: 'error',
    Business: 'primary',
    Family: 'warning',
    Holiday: 'success',
    ETC: 'info'
}

const RosterPage = () => {
    // ** Abilities
    const ability = useContext(AbilityContext)
    const CAN_CREATE_ROSTER = ability?.can(true, Roles.CAN_CREATE_ROSTER)

    // ** States
    const [calendarApi, setCalendarApi] = useState(null)
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
    const [addEventSidebarOpen, setAddEventSidebarOpen] = useState(false)
    const [branch, setBranch] = useState(null)

    // ** Hooks
    const { settings } = useSettings()
    const dispatch = useDispatch()

    const storeRoster = useSelector(state => state.storeRoster)
    const storeBranches = useSelector(state => state.storeBranches)

    // ** Vars
    const leftSidebarWidth = 300
    const addEventSidebarWidth = 400
    const { skin, direction } = settings
    const mdAbove = useMediaQuery(theme => theme.breakpoints.up('md'))

    // useEffect(() => {
    //     // dispatch(fetchEvents(store.selectedCalendars))
    // }, [dispatch, store.selectedCalendars])
    // const calendarRef = useRef(null)
    useEffect(() => {
        dispatch(getBranches())
    }, [dispatch])



    const selectBranch = (e) => {
        setBranch(e.target.value)

        const data = {
            branchId: e.target.value.id,
            startDate: moment(calendarApi.view.activeStart).format('YYYY-MM-DD'),
            endDate: moment(calendarApi.view.activeEnd).format('YYYY-MM-DD')
        }

        if (e.target.value !== 'None') dispatch(getShifts(data))
    }

    const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

    const handleAddEventSidebarToggle = () => {
        if (!branch) return toast.error('Please select branch first')
        setAddEventSidebarOpen(!addEventSidebarOpen)
    }

    return (
        <Grid container spacing={6.5}>
            <Grid item xs={6}>

                <PageHeader
                    title={
                        <Typography variant='h4'>
                            Roster
                        </Typography>
                    }
                    subtitle={
                        <Typography sx={{ color: 'text.secondary' }}>
                            You can view and manage your roster here.
                        </Typography>
                    }
                />
            </Grid>
            {CAN_CREATE_ROSTER &&
                <Grid item xs={6} sx={{
                    alignSelf: 'center',
                    textAlign: 'right'
                }}>
                    <Button onClick={handleAddEventSidebarToggle} variant="contained">
                        Create Roster
                    </Button>
                    {/* <Link href='/users/add'>
                        <Button variant="contained">
                            Create Roster
                        </Button>
                    </Link> */}
                </Grid>
            }
            <Grid item xs={12}>
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
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id='demo-simple-select-outlined-label'>
                                {storeBranches.branchLoading ? 'Loading...' : 'Select Branch'}
                            </InputLabel>
                            <Select
                                label='Select Branch'
                                defaultValue=''
                                id='select_branch'
                                labelId='select_branch-label'
                                onChange={selectBranch}
                                disabled={storeBranches.branchLoading}
                            >
                                {/* <MenuItem value='None'>
                                    <em>None</em>
                                </MenuItem> */}
                                {storeBranches.branches?.map((branch, index) => (
                                    <MenuItem key={index} value={branch}>
                                        {branch.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Divider variant={'fullWidth'} sx={{ mr: 0, mb: 6, mt: 6 }} />
                        <Calendar
                            can_create_roster={CAN_CREATE_ROSTER}
                            branch={branch}
                            storeRoster={storeRoster}
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
                    <AddEventSidebar

                        branch={branch}

                        // store={store}
                        dispatch={dispatch}

                        // addEvent={addEvent}
                        // updateEvent={updateEvent}
                        // deleteEvent={deleteEvent}
                        calendarApi={calendarApi}

                        drawerWidth={addEventSidebarWidth}

                        // handleSelectEvent={handleSelectEvent}
                        addEventSidebarOpen={addEventSidebarOpen}
                        handleAddEventSidebarToggle={handleAddEventSidebarToggle}
                    />
                </CalendarWrapper>
            </Grid>
        </Grid>

    )
}
RosterPage.acl = {
    action: true,
    subject: Roles.CAN_CREATE_ROSTER
}


export default RosterPage