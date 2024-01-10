// ** React Imports
import { useState, forwardRef } from 'react'

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Slide from '@mui/material/Slide'

// ** Custom Component Import

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import DialogDetailList from './DialogDetailList'
import DialogConfirmation from './DialogConfirmation'
import { HolidayStatusEnum } from './HolidayEnum'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})


const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const DialogHolidayDetail = props => {
  // ** Props
  const {
    show,
    setShow,
    event,
    CAN_VIEW_BRANCH_HOLIDAYS,
    CAN_APPROVE_BRANCH_HOLIDAYS,
  } = props

  // ** State
  const [open, setOpen] = useState(false)
  const [process, setProcess] = useState('')

  const holidayStatus = event?.extendedProps?.status

  return (
    <Dialog
      fullWidth
      open={show}
      maxWidth='sm'
      scroll='body'
      onClose={() => setShow(false)}
      TransitionComponent={Transition}
      onBackdropClick={() => setShow(false)}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <CustomCloseButton onClick={() => setShow(false)}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </CustomCloseButton>
        {/* <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography variant='h3' sx={{ mb: 3 }}>
            Holiday Detail
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Showing and editing holiday details for holiday
          </Typography>
        </Box> */}
        <DialogDetailList event={event} />
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'flex-end',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        {CAN_VIEW_BRANCH_HOLIDAYS && CAN_APPROVE_BRANCH_HOLIDAYS && (
          holidayStatus === HolidayStatusEnum.PENDING && (
            <>
              <Button variant='tonal' color='error' onClick={() => {
                setProcess(HolidayStatusEnum.REJECTED)
                setOpen(true)
              }}>
                Reject
              </Button>
              <Button variant='contained' color='success' sx={{ mr: 1 }} onClick={() => {
                setProcess(HolidayStatusEnum.APPROVED)
                setOpen(true)
              }}>
                Approve
              </Button>
            </>
          )
        )}
      </DialogActions>
      <DialogConfirmation
        open={open}
        setOpen={setOpen}
        eventId={event?.id}
        setShow={setShow}
        process={process}
      />
    </Dialog>
  )
}

export default DialogHolidayDetail
