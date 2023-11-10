// ** React Imports
import { useEffect, useState } from 'react'

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
import { addRole, deleteRole, getRoles, updateRole } from 'src/store/apps/user'
import { Chip, FormHelperText, Stack } from '@mui/material'
import clsx from 'clsx'
import { AlphaPicker, BlockPicker, ChromePicker, CirclePicker, CompactPicker, GithubPicker, HuePicker, MaterialPicker, PhotoshopPicker, SketchPicker, SliderPicker, SwatchesPicker } from 'react-color'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import DialogConfirmation from './DialogConfirmation'

const cardData = [
  { totalUsers: 4, title: 'Administrator', avatars: ['1.png', '2.png', '3.png', '4.png'] },
  { totalUsers: 7, title: 'Manager', avatars: ['5.png', '6.png', '7.png', '8.png', '1.png', '2.png', '3.png'] },
  { totalUsers: 5, title: 'Users', avatars: ['4.png', '5.png', '6.png', '7.png', '8.png'] },
  { totalUsers: 3, title: 'Support', avatars: ['1.png', '2.png', '3.png'] },
  { totalUsers: 2, title: 'Restricted User', avatars: ['4.png', '5.png'] }
]

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
  const [selectedCheckbox, setSelectedCheckbox] = useState([])
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState(false)
  const handleClickOpen = () => setOpen(true)
  const storeUsers = useSelector(state => state.storeUsers)
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
    setSelectedCheckbox([])
    setIsIndeterminateCheckbox(false)
  }

  const togglePermission = id => {
    const arr = selectedCheckbox
    if (selectedCheckbox.includes(id)) {
      arr.splice(arr.indexOf(id), 1)
      setSelectedCheckbox([...arr])
    } else {
      arr.push(id)
      setSelectedCheckbox([...arr])
    }
  }

  const handleSelectAllCheckbox = () => {
    if (isIndeterminateCheckbox) {
      setSelectedCheckbox([])
    } else {
      rolesArr.forEach(row => {
        const id = row.toLowerCase().split(' ').join('-')
        togglePermission(`${id}-read`)
        togglePermission(`${id}-write`)
        togglePermission(`${id}-create`)
      })
    }
  }
  useEffect(() => {
    if (selectedCheckbox.length > 0 && selectedCheckbox.length < rolesArr.length * 3) {
      setIsIndeterminateCheckbox(true)
    } else {
      setIsIndeterminateCheckbox(false)
    }
  }, [selectedCheckbox])

  useEffect(() => {
    dispatch(getRoles())
  }, [dispatch])

  const renderCards = () =>
    storeUsers?.roles?.map((item, index) => (
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
                <Typography color={'text.secondary'} variant='p'>
                  {item.description}
                </Typography>
              </Box>
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
            </Box>
          </CardContent>
        </Card>
        <DialogConfirmation
          confirmDelete={confirmDelete}
          setConfirmDelete={setConfirmDelete}
          roleId={selectedRole?.id}
          storeUsers={storeUsers}
        />
      </Grid>
    ))

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
      <Dialog fullWidth maxWidth='xs' scroll='body' onClose={handleClose} open={open}>
        <DialogTitle
          component='div'
          sx={{
            textAlign: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Typography variant='h3'>{`${dialogTitle} Role`}</Typography>
          <Typography color='text.secondary'>Set Role Permissions</Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(5)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
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
          <Stack direction='row' justifyContent={'center'} spacing={2} sx={{ mb: 4 }}>
            <CirclePicker onChangeComplete={color => {
              setRoleColor(color.hex)
              setValue('roleColor', color.hex)
              setError('roleColor', null)
            }} />
          </Stack>

        </DialogContent>
        <DialogActions
          sx={{
            // display: 'flex',
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button color='secondary' variant='tonal' onClick={handleClose}>
            Cancel
          </Button>
          <Button type='submit' variant='outlined' onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default RolesCards
