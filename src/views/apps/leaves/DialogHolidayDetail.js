// ** React Imports
import { useState, forwardRef, useContext } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Switch from '@mui/material/Switch'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { formatDate } from 'src/@core/utils/format'
import { Alert, Backdrop, CircularProgress } from '@mui/material'
import { AbilityContext } from 'src/layouts/components/acl/Can'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
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
  const { show, setShow, event } = props

  // ** States
  const ability = useContext(AbilityContext)
  const userAbility = ability.can(true, 'can_approve_leaves')

  const approvedStatus = event?.extendedProps?.approved

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
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography variant='h3' sx={{ mb: 3 }}>
            Holiday Detail
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Showing and editing holiday details for holiday
          </Typography>
        </Box>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {approvedStatus ? (
              <Alert severity='success'>This holiday has been approved</Alert>
            ) : (
              <Alert severity='warning'>This holiday is still pending approval</Alert>
            )}
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              disabled
              label='Full Name'
              defaultValue={event?.title}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <CustomTextField
              fullWidth
              disabled
              label='Start Date'
              defaultValue={formatDate(event?.start)}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <CustomTextField
              fullWidth
              disabled
              label='End Date'
              defaultValue={formatDate(event?.end)}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <CustomTextField
              fullWidth
              disabled
              label='Created Date'
              defaultValue={event?.extendedProps?.created_on}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <CustomTextField
              fullWidth
              disabled
              label='Approved Date'
              defaultValue={approvedStatus ? formatDate(event?.extendedProps?.approved_on) : 'N/A'}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'flex-end',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Button variant='tonal' color='secondary' onClick={() => setShow(false)}>
          Cancel
        </Button>
        {userAbility && (
          !approvedStatus && (
            <Button variant='contained' sx={{ mr: 1 }} onClick={() => setShow(false)}>
              Approve
            </Button>
          )
        )}
      </DialogActions>
      <Backdrop
        open={false}
        sx={{
          position: 'absolute',
          color: 'common.white',
          zIndex: theme => theme.zIndex.mobileStepper - 1
        }}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </Dialog>
  )
}

export default DialogHolidayDetail
