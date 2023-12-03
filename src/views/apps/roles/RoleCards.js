// ** React Imports
import { forwardRef, useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import Tooltip from '@mui/material/Tooltip'
import Checkbox from '@mui/material/Checkbox'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
import AvatarGroup from '@mui/material/AvatarGroup'
import CardContent from '@mui/material/CardContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import TableContainer from '@mui/material/TableContainer'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import { useDispatch, useSelector } from 'react-redux'
import { Backdrop, Chip, CircularProgress, Drawer, Fade, FormHelperText, Stack } from '@mui/material'
import clsx from 'clsx'
import { AlphaPicker, BlockPicker, ChromePicker, CirclePicker, CompactPicker, GithubPicker, HuePicker, MaterialPicker, PhotoshopPicker, SketchPicker, SliderPicker, SwatchesPicker } from 'react-color'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import DialogConfirmation from './DialogConfirmation'
import { addRole, getRoles, updateRole } from 'src/store/apps/role'
import styled from '@emotion/styled'

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

const rolesArr = [
  'User Management',
  'Content Management',
  'Disputes Management',
  'Database Management',
  'Financial Management',
  'Reporting',
  'API Control',
  'Repository Management',
  'Payroll'
]

const schema = yup.object().shape({
  roleName: yup.string().required('Role Name is required'),
  description: yup.string().required('Description is required'),
  roleColor: yup.string().required('Role Color is required')
})

const defaultValues = {
  roleName: '',
  description: '',
  roleColor: ''
}

const RolesCards = () => {
  // ** States
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('Add')
  const handleClickOpen = () => setOpen(true)
  const storeRoles = useSelector(state => state.storeRoles)
  const [roleColor, setRoleColor] = useState(null)
  const [selectedRole, setSelectedRole] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const {
    control,
    setError,
    setValue,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    if (dialogTitle === 'Add') {
      const role = {
        name: data.roleName,
        description: data.description,
        color: data.roleColor,
      }
      dispatch(addRole(role))
    } else {
      const role = {
        id: selectedRole.id,
        name: data.roleName,
        description: data.description,
        color: data.roleColor,
      }
      dispatch(updateRole(role))
    }
    handleClose()
    reset()
  }

  const handleClose = () => {
    setOpen(false)
    reset()
  }

  useEffect(() => {
    dispatch(getRoles())
  }, [dispatch])

  const renderCards = () =>
    storeRoles?.roles?.map((item, index) => (
      <Grid item xs={12} sm={6} lg={4} key={index}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: 'text.main' }}>{`Total ${item.users_quantity} users`}</Typography>
              <AvatarGroup
                max={4}
                className='pull-up'
                sx={{
                  '& .MuiAvatar-root': { width: 32, height: 32, fontSize: theme => theme.typography.body2.fontSize }
                }}
              >
                {item?.avatars?.map((img, index) => (
                  <Avatar key={index} alt={item.name} src={`/images/avatars/${img}`} />
                ))}
              </AvatarGroup>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                    <Box sx={{
                      borderRadius: 1,
                      bgcolor: item.color,
                      mb: 1,
                      p: 2,
                    }}>
                      <Typography color={'white'} variant='h5'>
                        {item.name}
                      </Typography>
                    </Box>
                    <Typography sx={{
                      whiteSpace: 'nowrap',

                      textOverflow: 'ellipsis',

                      overflow: 'hidden',
                    }} color={'text.secondary'} width={'100%'} variant='p'>
                      {item.description}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4} alignSelf={'flex-end'}>
                  <Stack direction='row' justifyContent={'flex-end'} spacing={0} sx={{ mb: 0 }}>
                    <IconButton color='info' onClick={e => {
                      e.preventDefault()
                      handleClickOpen()
                      setDialogTitle('Edit')
                      reset()
                      setValue('roleName', item.name)
                      setValue('description', item.description)
                      setValue('roleColor', item.color)
                      setRoleColor(item.color)
                      setSelectedRole(item)
                    }}>
                      <Icon icon='tabler:edit' />
                    </IconButton>
                    <IconButton color='error' onClick={() => {
                      setConfirmDelete(true)
                      setSelectedRole(item)
                    }}>
                      <Icon icon='tabler:trash' />
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
        <DialogConfirmation
          confirmDelete={confirmDelete}
          setConfirmDelete={setConfirmDelete}
          roleId={selectedRole?.id}
          storeRoles={storeRoles}
        />
      </Grid>
    ))

  const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(6),
    justifyContent: 'space-between'
  }))

  return (
    <Grid container spacing={6} className='match-height'>
      {renderCards()}
      <Grid item xs={12} sm={6} lg={4}>
        <Card
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            handleClickOpen()
            setDialogTitle('Add')
            reset()
            setRoleColor(null)
          }}
        >

          <Grid container sx={{ height: '100%' }}>
            <Grid item xs={5}>
              <Box
                sx={{
                  height: '100%',
                  minHeight: 140,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}
              >
                <img height={122} alt='add-role' src='/images/pages/add-new-role-illustration.png' />
              </Box>
            </Grid>
            <Grid item xs={7}>
              <CardContent sx={{ pl: 0, height: '100%' }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Button
                    variant='outlined'
                    sx={{ mb: 3, whiteSpace: 'nowrap' }}
                    onClick={() => {
                      handleClickOpen()
                      setDialogTitle('Add')
                    }}
                  >
                    Add New Role
                  </Button>
                  <Typography sx={{ color: 'text.secondary' }}>Add role, if it doesn't exist.</Typography>

                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      <Drawer
        open={open}
        anchor='right'
        variant='temporary'
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500 } } }}
      >
        <Header>
          <Typography variant='h5'>Add Branch</Typography>
          <IconButton
            size='small'
            onClick={handleClose}
            sx={{
              p: '0.438rem',
              borderRadius: 1,
              color: 'text.primary',
              backgroundColor: 'action.selected',
              '&:hover': {
                backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
              }
            }}
          >
            <Icon icon='tabler:x' fontSize='1.125rem' />
          </IconButton>
        </Header>
        <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
          <Box sx={{ my: 4 }}>
            <Controller
              name='roleName'
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  autoFocus
                  control={control}
                  rules={{ required: true }}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  label='Role Name'
                  placeholder='Enter Role Name'
                  error={Boolean(errors.roleName)}
                  {...(errors.roleName && { helperText: errors.roleName.message })}
                />

              )}
            />
          </Box>
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <Controller
                name='description'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    control={control}
                    rules={{ required: true }}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    multiline
                    rows={4}
                    label='Description'
                    placeholder='Enter Role Description'
                    error={Boolean(errors.description)}
                    {...(errors.description && { helperText: errors.description.message })}
                  />

                )}
              />
            </FormControl>
          </Box>
          <Stack direction='row' justifyContent={'center'} spacing={2} sx={{ mb: 4 }}>
            <CirclePicker onChangeComplete={color => {
              setRoleColor(color.hex)
              setValue('roleColor', color.hex)
              setError('roleColor', null)
            }} />
          </Stack>
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <Box bgcolor={roleColor} sx={{ borderRadius: 1, mb: 3, p: 2 }}>
                <Typography align={'center'} color={'white'} variant='h5'>
                  {roleColor}
                </Typography>
              </Box>
              {errors.roleColor && <FormHelperText error>{errors.roleColor.message}</FormHelperText>}
            </FormControl>
          </Box>

          <Box mt={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Button variant='tonal' color='secondary' sx={{ mr: 3 }} onClick={handleClose}>
              Cancel
            </Button>
            <Button type='submit' variant='outlined' onClick={handleSubmit(onSubmit)}>
              Save
            </Button>
          </Box>
        </Box>
      </Drawer>
      <Backdrop
        open={storeRoles.roleLoading}
        sx={{
          position: 'absolute',
          color: 'common.white',
          zIndex: theme => theme.zIndex.mobileStepper - 1
        }}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </Grid>
  )
}

export default RolesCards
