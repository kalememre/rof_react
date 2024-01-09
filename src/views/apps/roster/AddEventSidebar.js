// ** React Imports
import { useState, useEffect, forwardRef, useCallback, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import { TimeField } from '@mui/x-date-pickers';

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { getUserByBranch } from 'src/store/apps/user'
import { useSelector } from 'react-redux'
import { Checkbox, Chip, FormGroup, FormHelperText, Stack } from '@mui/material'
import { addShift } from 'src/store/apps/roster'
import { formatDate, formatDateRegular, formatDateTime, formatDateToMonthShort, formatTime } from 'src/@core/utils/format'

const capitalize = string => string && string[0].toUpperCase() + string.slice(1)

const defaultState = {
  url: '',
  title: '',
  guests: [],
  allDay: true,
  description: '',
  endDate: new Date(),

  // calendar: 'Business',
  startDate: new Date()
}

const AddEventSidebar = props => {
  // ** Props
  const {
    branch,
    store,
    dispatch,
    addEvent,
    updateEvent,
    drawerWidth,
    calendarApi,
    deleteEvent,
    handleSelectEvent,
    addEventSidebarOpen,
    handleAddEventSidebarToggle
  } = props

  // ** States
  const [values, setValues] = useState(defaultState)

  // ** Roster States
  const [selectedDates, setSelectedDates] = useState([]);
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [selectedTimes, setSelectedTimes] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);

  const handleCheckboxChange = (date) => {
    setSelectedTimes(prevState => ({
      ...prevState,
      [date]: prevState[date] ? null : { startTime: '', endTime: '' } // Set initial time values
    }));
  };

  const handleTimeChange = (date, field, value) => {
    setSelectedTimes(prevState => ({
      ...prevState,
      [date]: {
        ...prevState[date],
        [field]: value
      }
    }));
  };



  const loadDates = () => {
    const start = calendarApi?.view.activeStart;
    const end = calendarApi?.view.activeEnd;
    const dateArray = [];

    while (start < end) {

      const date = new Date(start);

      // add one day
      dateArray.push(date);
      start.setDate(start.getDate() + 1);

    }

    setSelectedDates(dateArray);
  }

  const storeUsers = useSelector(state => state.storeUsers)

  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { title: '' } })

  const handleSidebarClose = async () => {
    // setValues(defaultState)
    // clearErrors()
    // dispatch(handleSelectEvent(null))
    setSelectedUser(null);
    setSelectedDates([]);
    setSelectedTimes({});
    handleAddEventSidebarToggle()
  }

  const onSubmit = data => {
    const customErrors = [];

    const selectedData = Object.entries(selectedTimes).reduce((acc, [date, times]) => {
      if (times && times.startTime && times.endTime) {
        acc.push({
          date,
          startTime: times.startTime,
          endTime: times.endTime
        });
      } else if (times) {
        customErrors.push(`Please fill the ${date} time`);
      }


      return acc;
    }, []);

    // add branchId and userId to data

    selectedData.forEach((data) => {
      data.date = formatDateRegular(data.date);
      data.startTime = formatTime(data.startTime);
      data.endTime = formatTime(data.endTime);
      data.branchId = branch.id;
      data.userId = selectedUser;
    });

    dispatch(addShift(selectedData))
      .then((res) => {
        if (!res.error) {

          handleSidebarClose();
        }
      })
  }

  const handleDeleteEvent = () => {
    if (store.selectedEvent) {
      dispatch(deleteEvent(store.selectedEvent.id))
    }

    // calendarApi.getEventById(store.selectedEvent.id).remove()
    handleSidebarClose()
  }

  const handleStartDate = date => {
    if (date > values.endDate) {
      setValues({ ...values, startDate: new Date(date), endDate: new Date(date) })
    }
  }

  const handleSelectUser = (e) => {
    setSelectedUser(e.target.value);
    loadDates();
  }

  // const resetToStoredValues = useCallback(() => {
  //   if (store.selectedEvent !== null) {
  //     const event = store.selectedEvent
  //     setValue('title', event.title || '')
  //     setValues({
  //       url: event.url || '',
  //       title: event.title || '',
  //       allDay: event.allDay,
  //       guests: event.extendedProps.guests || [],
  //       description: event.extendedProps.description || '',
  //       calendar: event.extendedProps.calendar || 'Business',
  //       endDate: event.end !== null ? event.end : event.start,
  //       startDate: event.start !== null ? event.start : new Date()
  //     })
  //   }
  // }, [setValue, store.selectedEvent])

  const resetToEmptyValues = useCallback(() => {
    setValue('title', '')
    setValues(defaultState)
  }, [setValue])

  // useEffect(() => {
  //   if (store.selectedEvent !== null) {
  //     resetToStoredValues()
  //   } else {
  //     resetToEmptyValues()
  //   }
  // }, [addEventSidebarOpen, resetToStoredValues, resetToEmptyValues, store.selectedEvent])

  useEffect(() => {
    if (addEventSidebarOpen) {
      dispatch(getUserByBranch(branch.id))
    }
  }, [addEventSidebarOpen, branch, dispatch])

  const PickersComponent = forwardRef(({ ...props }, ref) => {
    return (
      <CustomTextField
        inputRef={ref}
        fullWidth
        {...props}
        label={props.label || ''}
        sx={{ width: '100%' }}
        error={props.error}
      />
    )
  })

  const RenderSidebarFooter = () => {
    return (
      <Fragment>
        <Button type='submit' onClick={onSubmit} variant='contained' sx={{ mr: 4 }}>
          Add
        </Button>
        <Button variant='tonal' color='secondary' onClick={resetToEmptyValues}>
          Reset
        </Button>
      </Fragment>
    )
  }

  return (
    <Drawer
      anchor='right'
      open={addEventSidebarOpen}
      variant='temporary'
      onClose={handleSidebarClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500 } } }}
    >
      <Box
        className='sidebar-header'
        sx={{
          p: 6,
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant='h5'>
          Add Roster
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size='small'
            onClick={handleSidebarClose}
            sx={{
              p: '0.375rem',
              borderRadius: 1,
              color: 'text.primary',
              backgroundColor: 'action.selected',
              '&:hover': {
                backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
              }
            }}
          >
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </IconButton>
        </Box>
      </Box>
      <Box className='sidebar-body' sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <DatePickerWrapper>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <Controller
              name='branch'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  label='Branch Name'
                  value={branch?.name ?? ''}
                  disabled
                  sx={{ mb: 4 }}
                />
              )}
            />
            <CustomTextField
              select
              fullWidth
              sx={{ mb: 4 }}
              label='User'
              defaultValue=''
              SelectProps={{
                value: selectedUser,
                displayEmpty: true,
                onChange: e => handleSelectUser(e),
              }}
            >
              {storeUsers.users.map((user, index) => (
                <MenuItem key={index} value={user.id}>
                  <Stack direction='row' alignItems='flex-start' justifyContent='flex-start'>
                    {user.fullName}

                    <Box key={index} ml={1} sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                      <Box sx={{
                        borderRadius: 1,
                        bgcolor: user.userProfile?.position.color,
                        color: 'white',
                        pr: 1,
                        pl: 1,
                      }}>
                        <span style={{
                          fontSize: '0.72rem',
                        }}>{user.userProfile?.position?.name}
                        </span>
                      </Box>

                    </Box>

                  </Stack>
                </MenuItem>
              ))}
            </CustomTextField>
            {selectedDates.map((date, i) => (
              <Stack key={i} mb={1} direction="row" alignItems="center" justifyContent="center" spacing={1}>
                <FormControl component="fieldset" sx={{ m: 1, width: "100%" }}>
                  <FormGroup aria-label="position" row>
                    <FormControlLabel
                      value="end"
                      control={<Checkbox checked={!!selectedTimes[date]} onChange={() => handleCheckboxChange(date)} />}
                      label={formatDateRegular(date)}
                      labelPlacement="end"
                    />
                  </FormGroup>
                </FormControl>
                <FormControl sx={{ m: 1, width: "50%" }}>
                  <TimeField
                    label="Start Time"
                    format="HH:mm"
                    size='small'
                    disabled={!selectedTimes[date]}

                    // value={selectedTimes[date]?.startTime || ''}
                    onChange={(value) => handleTimeChange(date, 'startTime', value)}
                  />
                </FormControl>
                <FormControl sx={{ m: 1, width: "50%" }}>
                  <TimeField
                    label="End Time"
                    format="HH:mm"
                    size='small'
                    disabled={!selectedTimes[date]}

                    // value={selectedTimes[date]?.endTime || ''}
                    onChange={(value) => handleTimeChange(date, 'endTime', value)}
                  />
                </FormControl>
              </Stack>
            ))}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <RenderSidebarFooter />
            </Box>
          </form>
        </DatePickerWrapper>
      </Box>
    </Drawer>
  )
}

export default AddEventSidebar
