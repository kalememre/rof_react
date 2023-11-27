// ** React Imports
import { useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// ** Custom Component Import
import CustomChip from 'src/@core/components/mui/chip'
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
import { Grid, InputLabel } from '@mui/material'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { CircleFlag } from 'react-circle-flags'
import { getBranches } from 'src/store/apps/branch'

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

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
}

const schema = yup.object().shape({
  // name: yup.string().required('Name field is required'),
  // surname: yup.string().required('Surname field is required'),
  // phone: yup.string().required('Phone field is required'),
  // email: yup.string().email('Invalid email').required('Email field is required'),
  // country: yup.string().required('Country field is required'),
  // ppsn: yup.string().required('PPSN field is required'),
  // passport: yup.string().required('Passport field is required'),
  // role: yup.string().required('Role field is required'),
  branch: yup.array().min(1, 'Branch field is required'),
})

const defaultValues = {
  name: '',
  surname: '',
  phone: '',
  email: '',
  country: '',
  ppsn: '',
  passport: '',
  role: '',
  branch: []
}


const SidebarAddUser = props => {
  // ** Props
  const { open, toggle, storeRoles } = props

  // ** State
  const [branch, setBranch] = useState([])

  const handleRoleChange = useCallback(e => {
    setRole(e.target.value)
  }, [])

  // ** Hooks
  const dispatch = useDispatch()
  const storeBranches = useSelector(state => state.storeBranches)


  useEffect(() => {
    dispatch(getBranches())
  }, [dispatch])

  const {
    reset,
    control,
    setValue,
    setError,
    trigger,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    console.log('data', data);

    // if (store.allData.some(u => u.email === data.email || u.username === data.username)) {
    //   store.allData.forEach(u => {
    //     if (u.email === data.email) {
    //       setError('email', {
    //         message: 'Email already exists!'
    //       })
    //     }
    //     if (u.username === data.username) {
    //       setError('username', {
    //         message: 'Username already exists!'
    //       })
    //     }
    //   })
    // } else {
    //   dispatch(addUser({ ...data, role, currentPlan: plan }))
    //   toggle()
    //   reset()
    // }
  }

  const handleClose = () => {
    // setPlan('basic')
    // setRole('subscriber')
    // setValue('contact', Number(''))
    setBranch([])
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
                    sx={{ mb: 2 }}
                    label='Name'
                    onChange={onChange}
                    placeholder="Enter user's name"
                    error={Boolean(errors.name)}
                    {...(errors.name && { helperText: errors.name.message })}
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
                    sx={{ mb: 2 }}
                    label='Surname'
                    onChange={onChange}
                    placeholder="Enter user's surname"
                    error={Boolean(errors.surname)}
                    {...(errors.surname && { helperText: errors.surname.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='phone'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    label='Phone'
                    value={value}
                    sx={{ mb: 2 }}
                    onChange={onChange}
                    error={Boolean(errors.phone)}
                    placeholder='Enter user phone'
                    {...(errors.phone && { helperText: errors.phone.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
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
                    sx={{ mb: 2 }}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    placeholder='johndoe@email.com'
                    {...(errors.email && { helperText: errors.email.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomAutocomplete
                autoHighlight
                id='autocomplete-country-select'
                options={countries}
                sx={{ mb: 2 }}
                onChange={(e, value) => setValue('country', value?.code ?? '')}
                getOptionLabel={option => option?.label || ''}
                renderOption={(props, option) => (
                  <Box component='li' sx={{ '& > img': { mr: 4, flexShrink: 0 } }} {...props}>
                    <CircleFlag countryCode={option.code.toLowerCase()} height="20" />
                    {option.label}
                  </Box>
                )}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label='Choose a country'
                    placeholder='Search for a country'
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password'
                    }}
                    error={Boolean(errors.country)}
                    {...(errors.country && { helperText: errors.country.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='ppsn'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 2 }}
                    label='PPSN / Tax / VAT'
                    onChange={onChange}
                    placeholder='Enter PPSN / Tax / VAT'
                    error={Boolean(errors.ppsn)}
                    {...(errors.ppsn && { helperText: errors.ppsn.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='passport'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 2 }}
                    label='Passport Number'
                    onChange={onChange}
                    placeholder='Enter Passport Number'
                    error={Boolean(errors.passport)}
                    {...(errors.passport && { helperText: errors.passport.message })}
                  />
                )}
              />
            </Grid>
            <Grid item sm={12} xs={12}>
              <Controller
                name='role'
                control={control}
                rules={{ required: true }}
                defaultValue=''
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Role'
                    sx={{ mb: 2 }}
                    disabled={storeRoles.loading}
                    defaultValue='Select Role'
                    error={Boolean(errors.role)}
                    {...(errors.role && { helperText: errors.role.message })}
                    SelectProps={{
                      value: value,
                      displayEmpty: true,
                      onChange: onChange,
                    }}
                  >
                    <MenuItem selected disabled value=''><em>Select Role</em></MenuItem>
                    {storeRoles.roles?.map((role, index) => (
                      <MenuItem key={index} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />

            </Grid>
            <Grid item sm={12} xs={12}>
              <CustomTextField
                select
                fullWidth
                label='Branch'
                id='select-branch-chip'
                sx={{ mb: 2 }}
                error={Boolean(errors.branch)}
                {...(errors.branch && { helperText: errors.branch.message })}
                SelectProps={{
                  MenuProps,
                  multiple: true,
                  value: branch,
                  onChange: e => {
                    setBranch(e.target.value)
                    setValue('branch', e.target.value)
                    trigger('branch')
                  },
                  renderValue: selected => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                      {selected.map(value => (
                        <CustomChip key={value.id} label={value.name} sx={{ m: 0.75 }} skin='light' color='primary' />
                      ))}
                    </Box>
                  )
                }}
              >
                {storeBranches.branches.map(branch => (
                  <MenuItem key={branch.id} value={branch}>
                    {branch.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
          </Grid>
          <Box mt={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
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
