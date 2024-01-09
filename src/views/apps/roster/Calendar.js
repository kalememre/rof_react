// ** React Import
import { useEffect, useRef } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import interactionPlugin from '@fullcalendar/interaction'

// ** Third Party Style Import
import 'bootstrap-icons/font/bootstrap-icons.css'
import { Backdrop, Box, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import { getShifts, publishRoster, updateShift } from 'src/store/apps/roster'
import moment from 'moment';
import toast from 'react-hot-toast'

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

  const EventRender = ({ event }) => (
    <>
      <Box p={1}>
        <Typography sx={{
          whiteSpace: 'initial',
          fontWeight: 'bold',
        }} color={'white'}>
          {event.title}
        </Typography>
        <Divider sx={{
          borderColor: 'white',
        }} />
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography color={'white'} fontSize={'lg'}>
            {event.extendedProps.startTime} - {event.extendedProps.endTime}
          </Typography>
          {/* {event.extendedProps.seen && (
          <CheckCircle fontSize='small' />
        )} */}
        </Stack>
      </Box>
    </>
  )

  const handlePublishShifts = () => {
    const data = {
      branchId: branch.id,
      startDate: moment(calendarApi.view.activeStart).format('YYYY-MM-DD'),
      endDate: moment(calendarApi.view.activeEnd).format('YYYY-MM-DD')
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
      eventClick({ event: clickedEvent }) {
        // check if event date older than today


        dispatch(handleSelectEvent(clickedEvent))
        handleAddEventSidebarToggle()

        // * Only grab required field otherwise it goes in infinity loop
        // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
        // event.value = grabEventDataFromEventApi(clickedEvent)
        // isAddNewEventSidebarActive.value = true
      },
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

      dateClick(info) {
        const ev = { ...blankEvent }
        ev.start = info.date
        ev.end = info.date
        ev.allDay = true

        // @ts-ignore
        dispatch(handleSelectEvent(ev))
        handleAddEventSidebarToggle()
      },

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
