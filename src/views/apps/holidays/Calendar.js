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
import { Box, Typography } from '@mui/material'
import DialogHolidayDetail from './DialogHolidayDetail'

// ** Icon Imports

const Calendar = props => {


  // ** Props
  const {
    storeHolidays,
    calendarApi,
    can_approve_holidays,
    can_see_branch_holidays,
    setCalendarApi,
    handleLeftSidebarToggle,
    dispatch,
  } = props

  // ** Event Rendering
  const EventRender = ({ event }) => {
    return (
      <Box m={1}>
        <Typography sx={{
          whiteSpace: 'initial',
          textShadow: '1px 1px 1px rgba(0,0,0,0.1)',
          wordWrap: 'break-word'
        }} color={'white'} variant='h6'>
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
  }, [calendarApi, setCalendarApi, storeHolidays])
  if (storeHolidays) {
    const calendarOptions = {
      ref: calendarRef,
      events: can_see_branch_holidays ? storeHolidays.filteredHolidays : storeHolidays.holidays,
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
        },
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
      },
      dateClick() {

      },
    }

    // @ts-ignore
    return (
      <Fragment>
        <FullCalendar {...calendarOptions} />
        <DialogHolidayDetail
          can_see_branch_holidays={can_see_branch_holidays}
          can_approve_holidays={can_approve_holidays}
          show={show}
          setShow={setShow}
          event={event}
        />
      </Fragment>
    )
  } else {
    return null
  }
}

export default Calendar
