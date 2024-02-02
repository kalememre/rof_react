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
    getShifts,
    resetRoster
} from 'src/store/apps/roster'
import { Button, Card, CardContent, CardHeader, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material'
import { getBranches } from 'src/store/apps/branch'
import PageHeader from 'src/@core/components/page-header'
import Link from 'next/link'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import toast from 'react-hot-toast'
import { Roles } from 'src/Roles'
import CardStatisticsExpenses from 'src/views/apps/roster/CardStatisticsExpenses'
import CardActiveProjects from 'src/views/apps/roster/CardActiveProjects'

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
        dispatch(resetRoster())
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

    const calculateCurrentWeekWorkHours = () => {
        const start = moment(calendarApi?.view.activeStart).format('YYYY-MM-DD')
        const end = moment(calendarApi?.view.activeEnd).format('YYYY-MM-DD')
        const shifts = storeRoster.shifts.filter(shift => moment(shift.start).isBetween(start, end, undefined, '[]'))

        const totalHours = shifts.reduce((acc, shift) => {
            const start = moment(shift.start)
            const end = moment(shift.end)
            const duration = moment.duration(end.diff(start))

            return acc + duration.asHours()
        }, 0)

        return totalHours.toFixed(2) || 0
    }

    const shiftTotalHours = (shift) => {
        const start = moment(shift.start)
        const end = moment(shift.end)
        const duration = moment.duration(end.diff(start))
        const hours = duration.asHours()

        return hours.toFixed(2)
    }

    const calculateTotalHoursByUser = () => {
        const start = moment(calendarApi?.view?.activeStart).format('YYYY-MM-DD');
        const end = moment(calendarApi?.view?.activeEnd).format('YYYY-MM-DD');

        const uniqueUserIds = [...new Set(storeRoster.shifts.map(shift => shift.extendedProps.userId))];

        const totalHoursByUser = uniqueUserIds.map(userId => {
            const shifts = storeRoster.shifts.filter(shift =>
                shift.extendedProps.userId === userId && moment(shift.start).isBetween(start, end, undefined, '[]')
            );

            let totalHours = 0;
            shifts.forEach(shift => {
                totalHours += parseFloat(shiftTotalHours(shift));
            });

            // Assuming shift.title, shift.extendedProps.position are available
            const userObj = {
                title: shifts.length > 0 ? shifts[0].title : '', // Assuming title is the same for all shifts of a user
                position: shifts.length > 0 ? shifts[0].extendedProps.position : '', // Assuming position is the same for all shifts of a user
                totalHours: totalHours.toFixed(2),
                color: shifts.length > 0 ? shifts[0].color : '',
                sort: shifts.length > 0 ? shifts[0].sort : '',
            };

            return userObj;
        });

        return totalHoursByUser;
    }

    const cardObjects = [
        {
            title: 'Total Hours',
            stats: calculateCurrentWeekWorkHours(),
            icon: 'clarity:clock-line',
            avatarColor: 'info',
            subtitle: 'Total working hours for this week'

        },
        {
            title: 'Branch Hours',
            stats: branch?.limitWorkHours || 'No Limit',
            icon: 'mdi:store-time',
            avatarColor: 'success',
            subtitle: 'Max working hours for this branch weekly'
        }
    ]

    const series = {
        limitWorkHours: branch?.limitWorkHours || 0,
        totalHours: calculateCurrentWeekWorkHours(),
        storeBranches: storeBranches,
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
                    <Stack direction="row" spacing={2} justifyContent={'flex-end'}>

                        <FormControl>
                            <InputLabel size='small' id='demo-simple-select-outlined-label'>
                                {storeBranches.branchLoading ? 'Loading...' : 'Select Branch'}
                            </InputLabel>
                            <Select
                                label='Select Branch'
                                defaultValue=''
                                id='select_branch'
                                labelId='select_branch-label'
                                onChange={selectBranch}
                                disabled={storeBranches.branchLoading}
                                sx={{
                                    textAlign: 'left',
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    display: 'flex'
                                }}
                                size='small'
                            >
                                {storeBranches.branches?.map((branch, index) => (
                                    <MenuItem key={index} value={branch}>
                                        {branch.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button onClick={handleAddEventSidebarToggle} variant="contained">
                            Create Roster
                        </Button>
                    </Stack>

                </Grid>
            }
            <Grid item xs={12}>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6} md={4} lg={2}>
                        <CardStatisticsExpenses {...series} />
                        <CardActiveProjects calculateTotalHoursByUser={calculateTotalHoursByUser} />
                    </Grid>
                    <Grid item xs={6} md={8} lg={10}>
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

            </Grid>
        </Grid>

    )
}
RosterPage.acl = {
    action: true,
    subject: Roles.CAN_CREATE_ROSTER
}


export default RosterPage