// ** React Imports
import { Fragment, useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Step from '@mui/material/Step'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stepper from '@mui/material/Stepper'
import MenuItem from '@mui/material/MenuItem'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Component Import
import CustomChip from 'src/@core/components/mui/chip'

// ** Custom Components Imports
import StepperCustomDot from './StepperCustomDot'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'
import { getBranches } from 'src/store/apps/branch'
import { getRoles } from 'src/store/apps/role'
import { useDispatch, useSelector } from 'react-redux'

// ** Data
import { countries } from 'src/@fake-db/autocomplete'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { CircleFlag } from 'react-circle-flags'
import { addUser } from 'src/store/apps/user'
import { Backdrop, CircularProgress } from '@mui/material'
import { useRouter } from 'next/router'

const steps = [
  {
    title: 'Account Details',
    subtitle: 'Enter your Account Details'
  },
  {
    title: 'Personal Info',
    subtitle: 'Setup Information'
  },
  {
    title: 'Permission',
    subtitle: 'Setup Permission'
  },
  {
    title: 'Finish',
    subtitle: 'Review and Submit'
  }
]

const defaultAccountValues = {
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  role: '',
  branch: []
}

const defaultPersonalValues = {
  country: '',
  PPSN: '',
  passport: '',
}

const defaultSocialValues = {
  google: '',
  twitter: '',
  facebook: '',
  linkedIn: ''
}

const accountSchema = yup.object().shape({
  // first_name: yup.string().required('Name field is required'),
  // last_name: yup.string().required('Surname field is required'),
  // phone: yup.string().required('Phone field is required'),
  // email: yup.string().email('Invalid email').required('Email field is required'),
  // role: yup.string().required('Role field is required'),
  // branch: yup.array().min(1, 'Branch field is required'),
})

const personalSchema = yup.object().shape({
  // country: yup.string().required('Country field is required'),
  // PPSN: yup.string().required('PPSN field is required'),
  // passport: yup.string().required('Passport field is required'),
})

const socialSchema = yup.object().shape({
  // google: yup.string().required(),
  // twitter: yup.string().required(),
  // facebook: yup.string().required(),
  // linkedIn: yup.string().required()
})

const StepperLinearWithValidation = () => {

  // ** State
  const [branch, setBranch] = useState([])
  const [activeStep, setActiveStep] = useState(0)
  const [country, setCountry] = useState('')


  const handleRoleChange = useCallback(e => {
    setRole(e.target.value)
  }, [])

  // ** Hooks
  const dispatch = useDispatch()
  const storeBranches = useSelector(state => state.storeBranches)
  const storeRoles = useSelector(state => state.storeRoles)
  const storeUsers = useSelector(state => state.storeUsers)

  const router = useRouter()


  useEffect(() => {
    dispatch(getBranches())
    dispatch(getRoles())
  }, [dispatch])


  const [state, setState] = useState({
    password: '',
    password2: '',
    showPassword: false,
    showPassword2: false
  })


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

  // ** Hooks
  const {
    reset: accountReset,
    control: accountControl,
    handleSubmit: handleAccountSubmit,
    setValue: setValueAccount,
    trigger: triggerAccount,
    getValues: getAccountValues,
    formState: { errors: accountErrors }
  } = useForm({
    defaultValues: defaultAccountValues,
    resolver: yupResolver(accountSchema)
  })

  const {
    reset: personalReset,
    control: personalControl,
    handleSubmit: handlePersonalSubmit,
    setValue: setValuePersonal,
    trigger: triggerPersonal,
    getValues: getPersonalValues,
    formState: { errors: personalErrors }
  } = useForm({
    defaultValues: defaultPersonalValues,
    resolver: yupResolver(personalSchema)
  })

  const {
    reset: socialReset,
    control: socialControl,
    handleSubmit: handleSocialSubmit,
    setValue: setValueSocial,
    formState: { errors: socialErrors }
  } = useForm({
    defaultValues: defaultSocialValues,
    resolver: yupResolver(socialSchema)
  })

  // Handle Stepper
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
    socialReset({ google: '', twitter: '', facebook: '', linkedIn: '' })
    accountReset({ email: '', username: '', password: '', 'confirm-password': '' })
    personalReset({ country: '', language: [], 'last-name': '', 'first-name': '' })
  }

  const handleMainSubmit = () => {
    // get all form data
    const user_profile = {
      role: getAccountValues().role,
      country: getPersonalValues().country,
      PPSN: getPersonalValues().PPSN,
      passport: getPersonalValues().passport,
      phone: getAccountValues().phone,
    }

    const data = {
      first_name: getAccountValues().first_name,
      last_name: getAccountValues().last_name,
      email: getAccountValues().email,
      user_profile: user_profile,
      branches: getAccountValues().branch,
    }
    const result = dispatch(addUser(data))
    result.then(res => {
      if (!res.error) {
        router.push('/users')
      }
    })

  }

  const onSubmit = (data) => {
    setActiveStep(activeStep + 1)
    if (activeStep === steps.length - 1) {
      toast.success('Form Submitted')
    }
  }

  // Handle Password
  const handleCountryChange = (event, value) => {
    setCountry(value)
    setValuePersonal('country', value?.code ?? '')
    triggerPersonal('country')
  }

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <form key={0} onSubmit={handleAccountSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[0].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[0].subtitle}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='first_name'
                  control={accountControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      sx={{ mb: 2 }}
                      label='Name'
                      onChange={onChange}
                      placeholder="Enter user's name"
                      error={Boolean(accountErrors.first_name)}
                      {...(accountErrors.first_name && { helperText: accountErrors.first_name.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='last_name'
                  control={accountControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      sx={{ mb: 2 }}
                      label='Surname'
                      onChange={onChange}
                      placeholder="Enter user's surname"
                      error={Boolean(accountErrors.last_name)}
                      {...(accountErrors.last_name && { helperText: accountErrors.last_name.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='email'
                  control={accountControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      type='email'
                      value={value}
                      label='Email'
                      onChange={onChange}
                      error={Boolean(accountErrors.email)}
                      placeholder='carterleonard@gmail.com'
                      aria-describedby='stepper-linear-account-email'
                      {...(accountErrors.email && { helperText: accountErrors.email.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='phone'
                  control={accountControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label='Phone'
                      value={value}
                      sx={{ mb: 2 }}
                      onChange={onChange}
                      error={Boolean(accountErrors.phone)}
                      placeholder='Enter user phone'
                      {...(accountErrors.phone && { helperText: accountErrors.phone.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Controller
                  name='role'
                  control={accountControl}
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
                      error={Boolean(accountErrors.role)}
                      {...(accountErrors.role && { helperText: accountErrors.role.message })}
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
              <Grid item sm={6} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  label='Branch'
                  id='select-branch-chip'
                  sx={{ mb: 2 }}
                  error={Boolean(accountErrors.branch)}
                  {...(accountErrors.branch && { helperText: accountErrors.branch.message })}
                  SelectProps={{
                    MenuProps,
                    multiple: true,
                    value: branch,
                    onChange: e => {
                      setBranch(e.target.value)
                      setValueAccount('branch', e.target.value)
                      triggerAccount('branch')
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
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant='tonal' color='secondary' disabled>
                  Back
                </Button>
                <Button type='submit' variant='contained'>
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      case 1:
        return (
          <form key={1} onSubmit={handlePersonalSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[1].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[1].subtitle}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name='PPSN'
                  control={personalControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      sx={{ mb: 2 }}
                      label='PPSN / Tax / VAT'
                      onChange={onChange}
                      placeholder='Enter PPSN / Tax / VAT'
                      error={Boolean(personalErrors.PPSN)}
                      {...(personalErrors.PPSN && { helperText: personalErrors.PPSN.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name='passport'
                  control={personalControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      sx={{ mb: 2 }}
                      label='Passport Number'
                      onChange={onChange}
                      placeholder='Enter Passport Number'
                      error={Boolean(personalErrors.passport)}
                      {...(personalErrors.passport && { helperText: personalErrors.passport.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomAutocomplete
                  autoHighlight
                  value={country}
                  id='autocomplete-country-select'
                  options={countries}
                  sx={{ mb: 2 }}
                  onChange={handleCountryChange}
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
                      error={Boolean(personalErrors.country)}
                      {...(personalErrors.country && { helperText: personalErrors.country.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant='tonal' color='secondary' onClick={handleBack}>
                  Back
                </Button>
                <Button type='submit' variant='contained'>
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      case 2:
        return (
          <form key={2} onSubmit={handleSocialSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[2].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[2].subtitle}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='twitter'
                  control={socialControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Twitter'
                      onChange={onChange}
                      error={Boolean(socialErrors.twitter)}
                      placeholder='https://twitter.com/carterLeonard'
                      aria-describedby='stepper-linear-social-twitter'
                      {...(socialErrors.twitter && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='facebook'
                  control={socialControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Facebook'
                      onChange={onChange}
                      error={Boolean(socialErrors.facebook)}
                      placeholder='https://facebook.com/carterLeonard'
                      aria-describedby='stepper-linear-social-facebook'
                      {...(socialErrors.facebook && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='google'
                  control={socialControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Google+'
                      onChange={onChange}
                      error={Boolean(socialErrors.google)}
                      aria-describedby='stepper-linear-social-google'
                      placeholder='https://plus.google.com/carterLeonard'
                      {...(socialErrors.google && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='linkedIn'
                  control={socialControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='LinkedIn'
                      onChange={onChange}
                      error={Boolean(socialErrors.linkedIn)}
                      placeholder='https://linkedin.com/carterLeonard'
                      aria-describedby='stepper-linear-social-linkedIn'
                      {...(socialErrors.linkedIn && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant='tonal' color='secondary' onClick={handleBack}>
                  Back
                </Button>
                <Button type='submit' variant='contained'>
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      case 3:
        return (
          <Box sx={{ position: 'relative', mb: 1 }}>
            <Backdrop
              open={storeUsers.userLoading}
              sx={{
                position: 'absolute',
                color: 'common.white',
                zIndex: theme => theme.zIndex.mobileStepper - 1
              }}
            >
              <CircularProgress color='inherit' />
            </Backdrop>

            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[3].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[3].subtitle}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='h3' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Account Details
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  Name: {getAccountValues().name}
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  Email: {getAccountValues().email}
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  Phone: {getAccountValues().phone}
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  Position: {storeRoles.roles?.find(role => role.id === getAccountValues().role)?.name}
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  Branches: {getAccountValues().branch?.map(branch => branch.name).join(', ')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='h3' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Personal Info
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  Country: {getPersonalValues().country !== '' ? <CircleFlag countryCode={getPersonalValues().country.toLowerCase()} height="32" /> : ''}
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  PPSN: {getPersonalValues().ppsn}
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  Passport Number: {getPersonalValues().passport}
                </Typography>
              </Grid>
            </Grid>
            <Grid mt={5} item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant='tonal' color='secondary' onClick={handleBack}>
                Back
              </Button>
              <Button type='submit' variant='contained' onClick={handleMainSubmit}>
                Submit
              </Button>
            </Grid>

          </Box>

        )
      default:
        return null
    }
  }

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <Fragment>
          <Typography>All steps are completed!</Typography>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant='tonal' color='secondary' onClick={handleBack}>
              Back
            </Button>
            <Button type='submit' variant='contained' onClick={handleMainSubmit}>
              Submit
            </Button>
          </Grid>

        </Fragment>
      )
    } else {
      return getStepContent(activeStep)
    }
  }

  return (
    <Card>
      <CardContent>
        <StepperWrapper>
          <Stepper activeStep={activeStep}>
            {steps.map((step, index) => {
              const labelProps = {}
              if (index === activeStep) {
                labelProps.error = false
                if (
                  (accountErrors.first_name ||
                    accountErrors.last_name ||
                    accountErrors.phone ||
                    accountErrors.email ||
                    accountErrors.role ||
                    accountErrors.branch &&
                    activeStep === 0
                  )) {
                  labelProps.error = true
                } else if (
                  (personalErrors.country ||
                    personalErrors.PPSN ||
                    personalErrors.passport) &&
                  activeStep === 1
                ) {
                  labelProps.error = true
                } else if (
                  (socialErrors.google || socialErrors.twitter || socialErrors.facebook || socialErrors.linkedIn) &&
                  activeStep === 2
                ) {
                  labelProps.error = true
                } else {
                  labelProps.error = false
                }
              }

              return (
                <Step key={index}>
                  <StepLabel {...labelProps} StepIconComponent={StepperCustomDot}>
                    <div className='step-label'>
                      <Typography className='step-number'>{`0${index + 1}`}</Typography>
                      <div>
                        <Typography className='step-title'>{step.title}</Typography>
                        <Typography className='step-subtitle'>{step.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>

      <Divider sx={{ m: '0 !important' }} />

      <CardContent>{renderContent()}</CardContent>
    </Card>
  )
}

export default StepperLinearWithValidation
