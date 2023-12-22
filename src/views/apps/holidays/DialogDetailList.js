// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import ListItem from '@mui/material/ListItem'
import List from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import LinearProgress from '@mui/material/LinearProgress'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Alert, AlertTitle, Divider, Grid, Typography } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { formatDate, formatDateTime } from 'src/@core/utils/format'
import { useState } from 'react'

const StyledList = styled(List)(({ theme }) => ({
  '& .MuiListItem-root': {
    border: `1px solid ${theme.palette.divider}`,
    '&:first-of-type': {
      borderTopLeftRadius: theme.shape.borderRadius,
      borderTopRightRadius: theme.shape.borderRadius
    },
    '&:last-child': {
      borderBottomLeftRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius
    },
    '&:not(:last-child)': {
      borderBottom: 0
    },
    '& .MuiListItemText-root': {
      margin: theme.spacing(0, 0, 2),
      '& .MuiTypography-root': {
        fontWeight: 500
      }
    }
  }
}))

const HolidayStatusEnum = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
  CANCELLED: 3,
};

const ApprovedSection = ({ event }) => {
  const eventStatus = event?.extendedProps?.status
  const statusTitle = eventStatus === HolidayStatusEnum.APPROVED ? 'Approved' : 'Rejected'
  const avatarColor = eventStatus === HolidayStatusEnum.APPROVED ? 'success' : 'error'
  const avatarIcon = eventStatus === HolidayStatusEnum.APPROVED ? 'tabler:check' : 'tabler:x'

  return (
    <ListItem>
      <ListItemAvatar>
        <CustomAvatar skin='light' variant='rounded' color={avatarColor} sx={{ height: 36, width: 36 }}>
          <Icon icon={avatarIcon} />
        </CustomAvatar>
      </ListItemAvatar>
      <Box sx={{ width: '100%' }}>
        <Typography variant='h5' sx={{ mb: 2 }}>
          {statusTitle} Detail
        </Typography>
        <Grid container spacing={3}>
          <Grid item sm={6} xs={12}>
            <CustomTextField
              fullWidth
              disabled
              label='Proceed By'
              defaultValue={event?.extendedProps?.proceedBy}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <CustomTextField
              fullWidth
              disabled
              label='Proceed Date'
              defaultValue={formatDateTime(event?.extendedProps?.proceedDate)}
            />
          </Grid>
        </Grid>
      </Box>
    </ListItem>
  )
}

// const RefuseSection = ({ event }) => {


const CustomAlert = ({ status }) => {
  const statusConfig = {
    0: { message: 'This holiday is pending for approval', severity: 'info' },
    1: { message: 'This holiday has been approved', severity: 'success' },
    2: { message: 'This holiday has been rejected', severity: 'error' },
    3: { message: 'This holiday has been cancelled', severity: 'warning' },
  };

  return <Alert severity={statusConfig[status].severity}>
    {statusConfig[status].message}
  </Alert>;
}

const DialogDetailList = props => {
  const { event } = props
  const holidayStatus = event?.extendedProps?.status

  return (
    <StyledList disablePadding>
      <Grid item xs={12} mb={3}>
        <CustomAlert status={holidayStatus} />
      </Grid>
      <ListItem>
        <ListItemAvatar>
          <CustomAvatar skin='light' variant='rounded' color='info' sx={{ height: 36, width: 36 }}>
            <Icon icon='tabler:user' />
          </CustomAvatar>
        </ListItemAvatar>
        <Box sx={{ width: '100%' }}>
          <Typography variant='h5' sx={{ mb: 2 }}>
            User Detail
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                disabled
                label='Full Name'
                defaultValue={event?.title}
              />
            </Grid>
            <Grid item sm={12} xs={12}>
              <CustomTextField
                fullWidth
                disabled
                label='Position'
                defaultValue={event?.extendedProps?.position}
              />
            </Grid>
          </Grid>
        </Box>
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <CustomAvatar skin='light' variant='rounded' color='warning' sx={{ height: 36, width: 36 }}>
            <Icon icon='tabler:beach' />
          </CustomAvatar>
        </ListItemAvatar>
        <Box sx={{ width: '100%' }}>
          <Typography variant='h5' sx={{ mb: 2 }}>
            Holiday Detail
          </Typography>
          <Grid container spacing={3}>
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
            <Grid item sm={12} xs={12}>
              <CustomTextField
                fullWidth
                disabled
                label='Description'
                multiline
                rows={5}
                defaultValue={event?.extendedProps?.description}
              />
            </Grid>
            <Grid item sm={12} xs={12}>
              <CustomTextField
                fullWidth
                disabled
                label='Created Date'
                defaultValue={formatDateTime(event?.extendedProps?.createdDate)}
              />
            </Grid>
          </Grid>
        </Box>
      </ListItem>
      {holidayStatus !== HolidayStatusEnum.PENDING && <ApprovedSection event={event} />}
    </StyledList>
  )
}

export default DialogDetailList
