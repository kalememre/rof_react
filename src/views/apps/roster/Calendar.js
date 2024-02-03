// ** React Import
import { useEffect, useRef, useState } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import interactionPlugin from '@fullcalendar/interaction'

// ** Third Party Style Import
import 'bootstrap-icons/font/bootstrap-icons.css'
import { Backdrop, Box, CircularProgress, Divider, FormHelperText, Stack, Typography } from '@mui/material'
import { getShifts, publishRoster, updateShift } from 'src/store/apps/roster'
import moment from 'moment';
import toast from 'react-hot-toast'
import { GridCheckCircleIcon, GridCheckIcon } from '@mui/x-data-grid'
import { Icon } from '@iconify/react'
import AmendShift from './AmendShift'

const blankEvent = {
  title: '',
  start: '',
  end: '',
  allDay: false,
  url: '',
  extendedProps: {
    calendar: '',
    guests: [],
    location: '',
    description: ''
  }
}

const Calendar = props => {
  // ** Props
  const {
    can_create_roster,
    branch,
    storeRoster,
    dispatch,
    direction,
    updateEvent,
    calendarApi,
    calendarsColor,
    setCalendarApi,
    handleSelectEvent,
    handleLeftSidebarToggle,
    handleAddEventSidebarToggle
  } = props

  // ** Refs
  const calendarRef = useRef(null)

  useEffect(() => {
    if (calendarApi === null) {
      // @ts-ignore
      setCalendarApi(calendarRef.current?.getApi())
    }
  }, [calendarApi, setCalendarApi])

  const [open, setOpen] = useState(false)
  const [event, setEvent] = useState(null)

  const handlerEventClick = (info) => {
    setEvent(info.event)
    setOpen(true)
  }

  const handlerGetShifts = () => {

    if (branch) {
      const data = {
        branchId: branch.id,
        startDate: moment(calendarApi?.view?.currentStart).format('YYYY-MM-DD'),
        endDate: moment(calendarApi?.view?.currentEnd).format('YYYY-MM-DD')
      }

      dispatch(getShifts(data))
    }
  }

  const shiftTotalHours = (shift) => {
    const start = moment(shift.start)
    const end = moment(shift.end)
    const duration = moment.duration(end.diff(start))
    const hours = duration.asHours()

    return hours.toFixed(2)
  }

  const EventRender = ({ event }) => {
    const formattedStart = moment(event.start).format('HH:mm');
    const formattedEnd = moment(event.end).format('HH:mm');
    const totalHours = shiftTotalHours(event);

    return (
      <Box>
        <Typography sx={{
          whiteSpace: 'initial',
          fontWeight: 'bold',
        }} color={'white'}>
          {event.title}
        </Typography>
        <FormHelperText sx={{ color: 'white', py: 0 }}>
          <i>{event.extendedProps.position}</i>
        </FormHelperText>
        <Divider sx={{
          borderColor: 'white',
          py: 0.5
        }} />
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography color={'white'} fontSize={'lg'} variant='h4' sx={{ fontFamily: 'technology' }}>
            {formattedStart} - {formattedEnd}
            <FormHelperText sx={{ color: 'white', py: 0 }}>
              Total Hours: {totalHours} h
            </FormHelperText>
          </Typography>
          {event.extendedProps.seen && (
            <Icon icon="tabler:checks" width="20" height="20" />
          )}
        </Stack>
      </Box>
    );
  };


  const handlePublishShifts = () => {
    const startDate = moment(calendarApi.view.activeStart).format('YYYY-MM-DD')
    const endDate = moment(calendarApi.view.activeEnd).format('YYYY-MM-DD')

    const data = {
      branchId: branch.id,
      startDate: startDate,
      endDate: endDate
    }
    dispatch(publishRoster(data))
  }

  if (storeRoster) {
    // ** calendarOptions(Props)
    const calendarOptions = {
      events: storeRoster.shifts,

      eventContent: EventRender,
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin, interactionPlugin],
      initialView: 'dayGridWeek',
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: 'excel,pdf' // user can switch between the two
      },
      views: {
        week: {
          titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
        }
      },

      datesSet: handlerGetShifts,

      /*
            Enable dragging and resizing event
            ? Docs: https://fullcalendar.io/docs/editable
          */
      editable: true,
      eventDurationEditable: false,
      showNonCurrentDates: false,
      firstDay: 1,

      // eventOrder: ["sort"],

      eventOrder: ["sort", "start", "title", "-duration"],

      // eventOrderStrict: true,

      // eventDragStop: (info) => {
      //   console.log('stop', info.event.start)
      //   console.log('stop', info.event)
      // },
      // eventDragStart: (info) => {
      //   console.log('start', info.event.start)
      //   console.log('start', info.event)
      // },

      /*
            Enable resizing event from start
            ? Docs: https://fullcalendar.io/docs/eventResizableFromStart
          */
      // eventResizableFromStart: true,

      /*
              Automatically scroll the scroll-containers during event drag-and-drop and date selecting
              ? Docs: https://fullcalendar.io/docs/dragScroll
            */
      dragScroll: true,

      /*
              Max number of events within a given day
              ? Docs: https://fullcalendar.io/docs/dayMaxEvents
            */
      // dayMaxEvents: 2,

      /*
              Determines if day names and week names are clickable
              ? Docs: https://fullcalendar.io/docs/navLinks
            */
      // navLinks: true,

      // eventClassNames({ event: calendarEvent }) {
      //   // @ts-ignore
      //   const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]

      //   return [
      //     // Background Color
      //     `bg-${colorName}`
      //   ]
      // },
      eventClick: handlerEventClick,
      customButtons: {
        excel: {
          text: 'Excel',
          click: handlePublishShifts
        },
        pdf: {
          text: 'PDF',
          click: handlePublishShifts
        }
      },

      // dateClick(info) {
      //   const ev = { ...blankEvent }
      //   ev.start = info.date
      //   ev.end = info.date
      //   ev.allDay = true

      //   // @ts-ignore
      //   dispatch(handleSelectEvent(ev))
      //   handleAddEventSidebarToggle()
      // },

      eventDrop({ event: droppedEvent, oldEvent, delta, revert, jsEvent, view }) {
        if (!moment(droppedEvent.start).isBefore(moment(), 'day')) {
          dispatch(updateShift(droppedEvent))
        } else {
          revert()
          toast.error('You cannot move shift to past date')
        }
      },

      // eventResize({ event: resizedEvent }) {
      //   dispatch(updateEvent(resizedEvent))
      // },
      ref: calendarRef,

      // Get direction from app state (store)
      direction
    }

    // @ts-ignore
    return (
      <>
        <FullCalendar {...calendarOptions} />
        <AmendShift open={open} event={event} setOpen={setOpen} />
        <Backdrop
          open={storeRoster.shiftLoading}
          sx={{
            position: 'absolute',
            color: 'common.white',
            zIndex: theme => theme.zIndex.mobileStepper - 1
          }}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      </>
    )
  } else {
    return null
  }
}

export default Calendar