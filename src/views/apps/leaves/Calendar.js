// ** React Import
import { Fragment, useEffect, useRef, useState } from 'react'

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
import DialogHolidayDetail from './DialogHolidayDetail'

const Calendar = props => {


  // ** Props
  const {
    storeHolidays,
    dispatch,
    direction,
    updateEvent,
    calendarApi,
    userAbility,
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
          textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
          wordWrap: 'break-word'
        }} color={event.extendedProps.approved ? 'white' : 'darkgray'} variant='h5'>
          {event.title}
        </Typography>
      </Box>
    )
  }

  // ** Dialog Toggle
  const [show, setShow] = useState(false)
  const [event, setEvent] = useState(null)

  // ** Refs
  const calendarRef = useRef()
  useEffect(() => {
    if (calendarApi === null) {
      // @ts-ignore
      setCalendarApi(calendarRef.current?.getApi())
    }
  }, [calendarApi, setCalendarApi])
  if (storeHolidays) {
    const calendarOptions = {
      ref: calendarRef,
      events: userAbility ? storeHolidays.filteredHolidays : storeHolidays.holidays,
      eventContent: EventRender,
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin, interactionPlugin],
      initialView: 'dayGridMonth',
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
        setShow(true)
        setEvent(clickedEvent)
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
    return (
      <Fragment>
        <FullCalendar {...calendarOptions} />
        <DialogHolidayDetail show={show} setShow={setShow} event={event} />
      </Fragment>
    )
  } else {
    return null
  }
}

export default Calendar
