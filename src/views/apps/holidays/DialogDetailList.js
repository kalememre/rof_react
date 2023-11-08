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
import { Alert, Divider, Grid, Typography } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { formatDate } from 'src/@core/utils/format'

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

const DialogDetailList = props => {
  const { event } = props
  const approvedStatus = event?.extendedProps?.approved

  return (
    <StyledList disablePadding>
      <Grid item xs={12} mb={3}>
        {approvedStatus ? (
          <Alert severity='success'>This holiday has been approved</Alert>
        ) : (
          <Alert severity='warning'>This holiday is still pending approval</Alert>
        )}
      </Grid>
      <ListItem>
        <ListItemAvatar>
          <CustomAvatar skin='light' variant='rounded' color='info' sx={{ height: 36, width: 36 }}>
            <Icon icon='tabler:user' />
          </CustomAvatar>
        </ListItemAvatar>
        <Box sx={{ width: '100%' }}>
          <Typography variant='h4' sx={{ mb: 2 }}>
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
                label='Role'
                defaultValue={event?.extendedProps?.role}
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
          <Typography variant='h4' sx={{ mb: 2 }}>
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
                defaultValue={event?.extendedProps?.created_on}
              />
            </Grid>
          </Grid>
        </Box>
      </ListItem>
      {approvedStatus &&
        <ListItem>
          <ListItemAvatar>
            <CustomAvatar skin='light' variant='rounded' color='success' sx={{ height: 36, width: 36 }}>
              <Icon icon='tabler:check' />
            </CustomAvatar>
          </ListItemAvatar>
          <Box sx={{ width: '100%' }}>
            <Typography variant='h4' sx={{ mb: 2 }}>
              Approval Detail
            </Typography>
            <Grid container spacing={3}>
              <Grid item sm={6} xs={12}>
                <CustomTextField
                  fullWidth
                  disabled
                  label='Approved By'
                  defaultValue={event?.extendedProps?.approved_by}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <CustomTextField
                  fullWidth
                  disabled
                  label='Approved Date'
                  defaultValue={event?.extendedProps?.approved_on}
                />
              </Grid>
            </Grid>
          </Box>
        </ListItem>
      }
    </StyledList>
  )
}

export default DialogDetailList
