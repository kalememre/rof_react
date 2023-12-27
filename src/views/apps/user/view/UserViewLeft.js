// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import LinearProgress from '@mui/material/LinearProgress'
import DialogContentText from '@mui/material/DialogContentText'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Utils Import
import { useDispatch, useSelector } from 'react-redux'
import { getUserById } from 'src/store/apps/user'
import { CircleFlag } from 'react-circle-flags'
import { Backdrop, CircularProgress } from '@mui/material'
import DialogConfirmation from './DialogConfirmation'
import { getInitials } from 'src/@core/utils/get-initials'

const data = {
  id: 1,
  role: 'admin',
  status: 'active',
  username: 'gslixby0',
  avatarColor: 'primary',
  country: 'El Salvador',
  company: 'Yotz PVT LTD',
  billing: 'Manual - Cash',
  contact: '(479) 232-9151',
  currentPlan: 'enterprise',
  fullName: 'Daisy Patterson',
  email: 'gslixby0@abc.net.au',
  avatar: '/images/avatars/14.png'
}

const roleColors = {
  admin: 'error',
  editor: 'info',
  author: 'warning',
  maintainer: 'success',
  subscriber: 'primary'
}

const statusColors = {
  'Active': 'success',
  'Inactive': 'secondary'
}

// ** Styled <sup> component
const Sup = styled('sup')(({ theme }) => ({
  top: 0,
  left: -10,
  position: 'absolute',
  color: theme.palette.primary.main
}))

// ** Styled <sub> component
const Sub = styled('sub')(({ theme }) => ({
  alignSelf: 'flex-end',
  color: theme.palette.text.disabled,
  fontSize: theme.typography.body1.fontSize
}))

const UserViewLeft = (params) => {
  const { storeUsers } = params

  // ** Store Vars
  const user = storeUsers?.user



  // ** States
  const [openEdit, setOpenEdit] = useState(false)
  const [openPlans, setOpenPlans] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false)

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)

  // Handle Upgrade Plan dialog
  const handlePlansClickOpen = () => setOpenPlans(true)
  const handlePlansClose = () => setOpenPlans(false)

  if (user) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ position: 'relative' }}>
              <CardContent sx={{ pt: 13.5, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                {!user.userProfile?.country ? (
                  <CustomAvatar
                    skin='light'

                    // color={row.avatarColor}
                    sx={{ width: 100, height: 100, fontWeight: 500, fontSize: theme => theme.typography.h2.fontSize }}
                  >
                    {getInitials(user.fullName ? user.fullName : 'John Doe')}
                  </CustomAvatar>
                ) : (
                  <img src={`/flags/${user.userProfile?.country.toLowerCase()}.svg`} alt='user flag' width='100' height='100' />
                )}
                <Typography variant='h4' sx={{ mb: 3 }}>
                  {user.fullName}
                </Typography>
                <Box sx={{
                  borderRadius: 1,
                  bgcolor: user.userProfile?.position.color,
                  p: 1,
                }}>
                  <Typography color={'white'}>
                    {user.userProfile?.position.name}
                  </Typography>
                </Box>
              </CardContent>

              <CardContent sx={{ pt: theme => `${theme.spacing(2)} !important` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* <Box sx={{ mr: 8, display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar color='info' skin='light' variant='rounded' sx={{ mr: 2.5, width: 38, height: 38 }}>
                      <Icon fontSize='1.75rem' icon='tabler:briefcase' />
                    </CustomAvatar>
                    <div>
                      <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>568</Typography>
                      <Typography variant='body2'>Hours Worked</Typography>
                    </div>
                  </Box> */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar color='info' skin='light' variant='rounded' sx={{ mr: 2.5, width: 38, height: 38 }}>
                      <Icon fontSize='1.75rem' icon='tabler:beach' />
                    </CustomAvatar>
                    <div>
                      <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>1.23k</Typography>
                      <Typography variant='body2'>Hours on Vacation</Typography>
                    </div>
                  </Box>
                </Box>
              </CardContent>

              <Divider sx={{ my: '0 !important', mx: 6 }} />

              <CardContent sx={{ pb: 4 }}>
                <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
                  Details
                </Typography>
                <Box sx={{ pt: 4 }}>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Email:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{user?.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Contact:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{user?.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Status:</Typography>
                    <CustomChip
                      rounded
                      skin='light'
                      size='small'
                      label={user?.isActive ? 'Active' : 'Inactive'}
                      color={statusColors[user.isActive ? 'Active' : 'Inactive']}
                      sx={{
                        textTransform: 'capitalize'
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Tax ID:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{user?.userProfile?.ppsn || <i>N/A</i>}</Typography>
                  </Box>
                </Box>

              </CardContent>

              <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                {/* <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
                  Edit
                </Button> */}
                <Button color='error' variant='tonal' onClick={() => setSuspendDialogOpen(true)}>
                  {user?.isActive ? 'Suspend' : 'Activate'}
                </Button>
              </CardActions>
              <DialogConfirmation
                suspendDialogOpen={suspendDialogOpen}
                setSuspendDialogOpen={setSuspendDialogOpen}
                id={user?.id}
                storeUsers={storeUsers}
              />
              <Backdrop
                open={storeUsers?.userLoading || storeUsers?.userProfileLoading}
                sx={{
                  position: 'absolute',
                  color: 'common.white',
                  zIndex: theme => theme.zIndex.mobileStepper - 1,
                }}
              >
                <CircularProgress color='inherit' />
              </Backdrop>
            </Box>



          </Card>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default UserViewLeft
