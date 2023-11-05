import React, { Fragment, useContext } from 'react'

// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'
import { styled } from '@mui/material/styles'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'
import Calendar from 'src/views/apps/leaves/Calendar'
import { getLeaves } from 'src/store/apps/leaves'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Accordion, AccordionDetails, AccordionSummary, Backdrop, Card, CardContent, CardHeader, CircularProgress, Collapse, FormControl, Grid, IconButton, InputLabel, ListItem, ListItemAvatar, MenuItem, Select, Stack, Typography } from '@mui/material'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { getBranches, getRoles } from 'src/store/apps/user'
import IconifyIcon from 'src/@core/components/icon'
import { useTheme } from '@mui/material/styles'
import ListUsers from 'src/views/components/list/ListUsers'

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
    const theme = useTheme()

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
                <Card sx={{ position: 'relative', mb: 1 }}>
                    <CardContent>
                        <Grid container>

                            <Grid
                                item
                                xs={12}
                                sm={8}>

                                <Typography variant='h5' sx={{ mb: 0.5 }}>
                                    Filter Leaves by Branch
                                </Typography>
                                <Typography sx={{ mb: 3, color: 'text.secondary' }}>
                                    Select a branch to view its leaves.
                                </Typography>

                                <FormControl sx={{ width: '75%' }}>
                                    <InputLabel id='demo-simple-select-outlined-label'>
                                        {isLoading ? 'Loading...' : 'Select Branch'}
                                    </InputLabel>
                                    <Select
                                        label='Select Branch'
                                        defaultValue=''
                                        id='select_branch'
                                        labelId='select_branch-label'
                                        onChange={selectBranch}
                                        disabled={isLoading}
                                    >
                                        <MenuItem value=''>
                                            <em>None</em>
                                        </MenuItem>
                                        {branches?.map((branch, index) => (
                                            <MenuItem key={index} value={branch.id}>
                                                {branch.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={4}
                                sx={{
                                    order: [1, 2],
                                    textAlign: 'center',
                                    '& img': {
                                        height: '100px !important',
                                        maxWidth: 'none !important',
                                        [theme.breakpoints.up('xs')]: {
                                            top: '50%',
                                            position: 'absolute',
                                            right: theme.spacing(6),
                                            transform: 'translateY(-50%)'
                                        }
                                    }
                                }}
                            >
                                <img src='/images/cards/graphic-illustration-2.png' alt='branch' />
                            </Grid>
                        </Grid>

                    </CardContent>
                    <Backdrop
                        open={isLoading}
                        sx={{
                            position: 'absolute',
                            color: 'common.white',
                            zIndex: theme => theme.zIndex.mobileStepper - 1
                        }}
                    >
                        <CircularProgress color='inherit' />
                    </Backdrop>
                </Card>

            )}
            <Accordion>
                <AccordionSummary
                    id='panel-header-1'
                    aria-controls='panel-content-1'
                    expandIcon={<IconifyIcon fontSize='1.25rem' icon='tabler:chevron-down' />}
                >
                    <Typography>Roles Color List</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ListUsers roles={roles} />
                </AccordionDetails>
            </Accordion>
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