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
import { Box, Stack, Typography } from '@mui/material'

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
    store,
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

  // ** Event Rendering
  const EventRender = ({ event }) => {
    return (
      <Box p={1}>
        <Typography sx={{
          whiteSpace: 'initial',
          textShadow: '1px 1px 1px rgba(0,0,0,0.3)',
          wordWrap: 'break-word'
        }} color={'white'}>
          {event.title}
        </Typography>
      </Box>
    )
  }

  // ** Refs
  const calendarRef = useRef()
  useEffect(() => {
    if (calendarApi === null) {
      // @ts-ignore
      setCalendarApi(calendarRef.current?.getApi())
    }
  }, [calendarApi, setCalendarApi])
  if (store) {
    // ** calendarOptions(Props)
    const calendarOptions = {
      ref: calendarRef,
      events: store.leaves.length ? store.leaves : [],
      eventContent: EventRender,
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin, interactionPlugin],
      initialView: 'dayGridWeek',
      headerToolbar: {
        left: 'prev,next ,today',
        center: 'title',
        right: 'dayGridWeek,dayGridMonth'
      },
      views: {
        week: {
          titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
        }
      },
      firstDay: 1,

      // eventClassNames({ event: calendarEvent }) {
      //   // @ts-ignore
      //   const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]

      //   return [
      //     // Background Color
      //     `bg-${colorName}`
      //   ]
      // },
      eventClick({ event: clickedEvent }) {

      },
      customButtons: {
        sidebarToggle: {
          icon: 'bi bi-list',
          click() {
            handleLeftSidebarToggle()
          }
        },
        addEvent: {
          text: 'Add Event',

          // icon: 'bi bi-plus',
          click() {
            handleAddEventSidebarToggle()
          }
        }
      },
      dateClick(info) {

      },
    }

    // @ts-ignore
    return <FullCalendar {...calendarOptions} />
  } else {
    return null
  }
}

export default Calendar
