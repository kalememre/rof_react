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
import { Checkbox, Chip, FormGroup, FormHelperText, Grid, Stack, TextField } from '@mui/material'
import { addShift } from 'src/store/apps/roster'
import { formatDate, formatDateRegular, formatDateTime, formatDateToMonthShort, formatTime, mergeDateAndTime } from 'src/@core/utils/format'
import moment from 'moment'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

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
  const [selectedUser, setSelectedUser] = useState('');

  // const handleCheckboxChange = (date) => {
  //   const nd = moment(date).format('YYYY-MM-DD');
  //   setSelectedTimes(prevState => ({
  //     ...prevState,
  //     [nd]: prevState[nd] ? null : { startTime: '', endTime: '' } // Set initial time values
  //   }));
  // };

  const handleTimeChange = (date, field, value) => {
    const nd2 = moment(date).format('YYYY-MM-DD');
    const nd = new Date(date);
    const newdate = mergeDateAndTime(nd, value);

    setSelectedTimes(prevState => ({
      ...prevState,
      [nd2]: {
        ...prevState[nd2],
        [field]: newdate
      }
    }));
  };



  const loadDates = () => {
    const start = calendarApi?.view.activeStart;
    const end = calendarApi?.view.activeEnd;
    const dateArray = [];

    while (start < end) {
      const date = new Date(start);
      dateArray.push({
        date: date.toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        checked: false
      });
      start.setDate(start.getDate() + 1);
    }
    console.log('dateArray', dateArray);
    setWeekEvents(dateArray);

    // setSelectedDates(dateArray);
  }

  const storeUsers = useSelector(state => state.storeUsers)

  // const schema = yup.object().shape({
  //   events: yup.array().of(
  //     yup.object().shape({
  //       // date: yup.string().required('Tarih zorunludur.'),
  //       start: yup.string().required('Başlangıç saati zorunludur.'),
  //       end: yup.string().required('Bitiş saati zorunludur.'),
  //     })
  //   ),
  // });

  const schema = yup.object().shape({
    events: yup.array().of(
      yup.object().shape({
        start: yup.string().when('checked', {
          is: true,
          then: yup.string().required('Başlangıç saati zorunludur.'),
        }),
        end: yup.string().when('checked', {
          is: true,
          then: yup.string().required('Bitiş saati zorunludur.'),
        }),
        checked: yup.boolean(),
      })
    ),
  });

  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) });

  const handleSidebarClose = async () => {
    // setValues(defaultState)
    clearErrors()

    // dispatch(handleSelectEvent(null))
    setSelectedUser('');
    setSelectedDates([]);
    setSelectedTimes({});
    handleAddEventSidebarToggle()
  }

  const [weekEvents, setWeekEvents] = useState([]);

  const handleCheckboxChange = (index) => {
    const updatedWeekEvents = [...weekEvents];
    updatedWeekEvents[index].checked = !updatedWeekEvents[index].checked;
    setWeekEvents(updatedWeekEvents);
  };

  const onSubmit = data => {
    console.log('data', data);

    // const customErrors = [];
    // console.log('selectedTimes', selectedTimes);

    // const selectedData = Object.entries(selectedTimes).reduce((acc, [date, times]) => {
    //   if (times && times.startTime && times.endTime) {
    //     acc.push({
    //       date,
    //       startTime: times.startTime,
    //       endTime: times.endTime
    //     });
    //   } else if (times) {
    //     customErrors.push(`Please fill the ${date} time`);
    //   }


    //   return acc;
    // }, []);

    // selectedData.forEach((data) => {
    //   data.date = formatDateRegular(data.date);
    //   data.startTime = formatTime(data.startTime);
    //   data.endTime = formatTime(data.endTime);
    //   data.branchId = branch.id;
    //   data.userId = selectedUser;
    // });

    // dispatch(addShift(selectedData))
    //   .then((res) => {
    //     if (!res.error) {

    //       handleSidebarClose();
    //     }
    //   })
  }

  const handleSelectUser = (e) => {
    setSelectedUser(e.target.value);
    loadDates();
  }



  useEffect(() => {
    if (addEventSidebarOpen) {
      dispatch(getUserByBranch(branch.id))
    }
  }, [addEventSidebarOpen, branch, dispatch])


  const RenderSidebarFooter = () => {
    return (
      <Fragment>
        <Button type='submit' onClick={handleSubmit(onSubmit)} variant='contained' sx={{ mr: 4 }}>
          Add
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
            {/* {selectedDates.map((date, i) => (
              <Stack key={i} mb={1} direction="row" alignItems="center" justifyContent="center" spacing={1}>
                <FormControl component="fieldset" sx={{ m: 1, width: "100%" }}>
                  <FormGroup aria-label="position" row>
                    <FormControlLabel
                      value="end"
                      control={<Checkbox checked={!!selectedTimes[moment(date).format('YYYY-MM-DD')]} onChange={() => handleCheckboxChange(date)} />}
                      label={moment(date).format('DD MMMM YYYY')}
                      labelPlacement="end"
                    />
                  </FormGroup>
                </FormControl>
                <FormControl sx={{ m: 1, width: "50%" }}>
                  <TimeField
                    label="Start Time"
                    format="HH:mm"
                    size='small'
                    disabled={!selectedTimes[moment(date).format('YYYY-MM-DD')]}

                    onChange={(value) => handleTimeChange(date, 'startTime', value)}
                  />
                </FormControl>
                <FormControl sx={{ m: 1, width: "50%" }}>
                  <TimeField
                    label="End Time"
                    format="HH:mm"
                    size='small'
                    disabled={!selectedTimes[moment(date).format('YYYY-MM-DD')]}

                    onChange={(value) => handleTimeChange(date, 'endTime', value)}
                  />
                </FormControl>
              </Stack>
            ))} */}
            {weekEvents.map((event, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={() => handleCheckboxChange(index)}
                        checked={event.checked}
                      />
                    }
                    label={event.date}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Controller
                    name={`events[${index}].start`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TimeField
                        {...field}
                        label="Start Time"
                        format='HH:mm'
                        size='small'
                        disabled={!event.checked}
                        error={!!errors.events && !!errors.events[index]?.start}
                        helperText={errors.events && errors.events[index]?.start?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Controller
                    name={`events[${index}].end`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TimeField
                        {...field}
                        label="End Time"
                        format='HH:mm'
                        size='small'
                        disabled={!event.checked}
                        error={!!errors.events && !!errors.events[index]?.end}
                        helperText={errors.events && errors.events[index]?.end?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
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
