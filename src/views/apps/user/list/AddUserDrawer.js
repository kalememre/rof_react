// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Data
import { countries } from 'src/@fake-db/autocomplete'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'
import { Grid } from '@mui/material'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { CircleFlag } from 'react-circle-flags'

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  company: yup.string().required(),
  billing: yup.string().required(),
  country: yup.string().required(),
  email: yup.string().email().required(),
  contact: yup
    .number()
    .typeError('Contact Number field is required')
    .min(10, obj => showErrors('Contact Number', obj.value.length, obj.min))
    .required(),
  fullName: yup
    .string()
    .min(3, obj => showErrors('First Name', obj.value.length, obj.min))
    .required(),
  username: yup
    .string()
    .min(3, obj => showErrors('Username', obj.value.length, obj.min))
    .required()
})

const defaultValues = {
  email: '',
  company: '',
  country: '',
  billing: '',
  fullName: '',
  username: '',
  contact: Number('')
}


const SidebarAddUser = props => {
  // ** Props
  const { open, toggle } = props

  // ** State
  const [plan, setPlan] = useState('basic')
  const [role, setRole] = useState('subscriber')

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.user)

  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    if (store.allData.some(u => u.email === data.email || u.username === data.username)) {
      store.allData.forEach(u => {
        if (u.email === data.email) {
          setError('email', {
            message: 'Email already exists!'
          })
        }
        if (u.username === data.username) {
          setError('username', {
            message: 'Username already exists!'
          })
        }
      })
    } else {
      dispatch(addUser({ ...data, role, currentPlan: plan }))
      toggle()
      reset()
    }
  }

  const handleClose = () => {
    setPlan('basic')
    setRole('subscriber')
    setValue('contact', Number(''))
    toggle()
    reset()
  }



  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500 } } }}
    >
      <Header>
        <Typography variant='h5'>Add User</Typography>
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Name'
                    onChange={onChange}
                    placeholder="Enter user's name"
                    error={Boolean(errors.fullName)}
                    {...(errors.fullName && { helperText: errors.fullName.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='surname'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Surname'
                    onChange={onChange}
                    placeholder="Enter user's surname"
                    error={Boolean(errors.username)}
                    {...(errors.username && { helperText: errors.username.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type='email'
                    label='Email'
                    value={value}
                    sx={{ mb: 4 }}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    placeholder='johndoe@email.com'
                    {...(errors.email && { helperText: errors.email.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='country'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomAutocomplete
                    autoHighlight
                    id='autocomplete-country-select'
                    options={countries}
                    getOptionLabel={option => option.label || ''}
                    renderOption={(props, option) => (
                      <Box component='li' sx={{ '& > img': { mr: 4, flexShrink: 0 } }} {...props}>
                        <CircleFlag countryCode={option.code.toLowerCase()} height="20" />
                        {option.label} ({option.code})
                      </Box>
                    )}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        label='Choose a country'
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password'
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='contact'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type='number'
                    value={value}
                    sx={{ mb: 4 }}
                    label='Contact'
                    onChange={onChange}
                    placeholder='(397) 294-5153'
                    error={Boolean(errors.contact)}
                    {...(errors.contact && { helperText: errors.contact.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='billing'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    sx={{ mb: 4 }}
                    label='Billing'
                    id='validation-billing-select'
                    error={Boolean(errors.billing)}
                    aria-describedby='validation-billing-select'
                    {...(errors.billing && { helperText: errors.billing.message })}
                    SelectProps={{ value: value, onChange: e => onChange(e) }}
                  >
                    <MenuItem value=''>Billing</MenuItem>
                    <MenuItem value='Auto Debit'>Auto Debit</MenuItem>
                    <MenuItem value='Manual - Cash'>Manual - Cash</MenuItem>
                    <MenuItem value='Manual - Paypal'>Manual - Paypal</MenuItem>
                    <MenuItem value='Manual - Credit Card'>Manual - Credit Card</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Button variant='tonal' color='secondary' sx={{ mr: 3 }} onClick={handleClose}>
              Cancel
            </Button>
            <Button type='submit' variant='contained' >
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddUser
