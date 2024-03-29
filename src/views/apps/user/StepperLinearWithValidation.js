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
import { getPositions } from 'src/store/apps/position'
import { useDispatch, useSelector } from 'react-redux'

// ** Data
import { countries } from 'src/@fake-db/autocomplete'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { CircleFlag } from 'react-circle-flags'
import { addUser } from 'src/store/apps/user'
import { Backdrop, Checkbox, CircularProgress, FormControlLabel, FormHelperText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material'
import { useRouter } from 'next/router'
import { getPermissions } from 'src/store/apps/permissions'

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
  position: '',
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
  // position: yup.string().required('Position field is required'),
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

const rolesArr = [
  {
    "name": 'User Management',
    "permissions": [
      {
        "name": 'Can Create User',
        "code": 'can_create_user'
      },
      {
        "name": 'Can Delete User',
        "code": 'can_delete_user'
      },
      {
        "name": 'Can See Branch Users',
        "code": 'can_see_branch_users'
      },
    ],
  },
  {
    "name": 'Announcements Management',
    "permissions": [
      {
        "name": "Can Receive Announcements",
        "code": "can_receive_announcements"
      },
      {
        "name": "Can Create Announcements",
        "code": "can_create_announcements"
      }
    ],
  },
  {
    "name": 'Holiday Management',
    "permissions": [
      {
        "name": 'Can Approve Holidays',
        "code": 'can_approve_holidays'
      },
      {
        "name": 'Can See Branch Holidays',
        "code": 'can_see_branch_holidays'
      },
    ],
  },
  {
    "name": 'Roster Management',
    "permissions": [
      {
        "name": 'Can Create Roster',
        "code": 'can_create_roster'
      },
      {
        "name": 'Can Publish Roster',
        "code": 'can_publish_roster'
      },
      {
        "name": 'Can See Branch Roster',
        "code": 'can_see_branch_roster'
      },
      {
        "name": 'Can Rosterable',
        "code": 'can_rosterable'
      },
    ],
  },
]

const StepperLinearWithValidation = () => {

  // ** State
  const [branch, setBranch] = useState([])
  const [activeStep, setActiveStep] = useState(0)
  const [country, setCountry] = useState('')
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  const handleRoleChange = useCallback(e => {
    setRole(e.target.value)
  }, [])

  // ** Hooks
  const dispatch = useDispatch()
  const storeBranches = useSelector(state => state.storeBranches)
  const storePositions = useSelector(state => state.storePositions)
  const storeUsers = useSelector(state => state.storeUsers)
  const storePermissions = useSelector(state => state.storePermissions)

  const router = useRouter()

  useEffect(() => {
    dispatch(getBranches())
    dispatch(getPositions())
    dispatch(getPermissions())
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
    formState: { errors: accountErrors },
    setError: setAccountError
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

  const handleMainSubmit = () => {
    // get all form data
    const user_profile = {
      position: getAccountValues().position,
      country: getPersonalValues().country,
      PPSN: getPersonalValues().PPSN,
      passport: getPersonalValues().passport,
    }

    const data = {
      firstName: getAccountValues().first_name,
      lastName: getAccountValues().last_name,
      email: getAccountValues().email,
      phone: getAccountValues().phone,
      userProfile: user_profile,
      branches: getAccountValues().branch.map(branch => branch.id),
      roles: selectedCheckbox
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

  const groupedPermissions = {};
  storePermissions.permissions.forEach((permission) => {
    if (!groupedPermissions[permission.roleType]) {
      groupedPermissions[permission.roleType] = [];
    }
    groupedPermissions[permission.roleType].push(permission);
  });

  const onEmailBlur = (e) => {
    // console.log('email blur', e.target.value)
    // setAccountError('email', {
    //   type: 'manual',
    //   message: 'Email already exists'
    // })
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
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      type='email'
                      value={value}
                      label='Email'
                      onChange={onChange}
                      onBlur={onEmailBlur}
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
                  name='position'
                  control={accountControl}
                  rules={{ required: true }}
                  defaultValue=''
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label='Position'
                      sx={{ mb: 2 }}
                      disabled={storePositions.loading}
                      defaultValue='Select Position'
                      error={Boolean(accountErrors.position)}
                      {...(accountErrors.position && { helperText: accountErrors.position.message })}
                      SelectProps={{
                        value: value,
                        displayEmpty: true,
                        onChange: onChange,
                      }}
                    >
                      <MenuItem selected disabled value=''><em>Select Position</em></MenuItem>
                      {storePositions.positions?.map((position, index) => (
                        <MenuItem key={index} value={position.id}>
                          {position.name}
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
              <Grid item xs={12} sm={12}>
                <TableContainer>
                  <Table size='small'>
                    <TableBody>
                      {Object.keys(groupedPermissions).map((roleType, index) => (
                        <TableRow
                          key={index} // Adding key prop for TableRow
                          sx={{
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            fontSize: theme => theme.typography.h6.fontSize,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                          }}
                        >
                          <TableCell
                            key={roleType} // Adding key prop for TableCell
                            sx={{
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                              fontSize: theme => theme.typography.h6.fontSize,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              width: '100%'
                            }}
                          >
                            <Typography variant='h5' sx={{ fontWeight: 600, color: 'primary.main', textTransform: 'capitalize' }}>
                              {roleType.toLowerCase()} Management
                            </Typography>
                            {groupedPermissions[roleType].map((permission, permissionIndex) => (
                              <FormControlLabel
                                key={permissionIndex} // Adding key prop for FormControlLabel
                                label={
                                  <div>
                                    <Typography variant='body' sx={{ fontWeight: 600, color: 'text.primary' }}>
                                      {permission.roleLabel}
                                    </Typography>
                                    <FormHelperText>{permission.description}</FormHelperText>
                                  </div>
                                }
                                sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                                control={
                                  <Checkbox
                                    size='small'
                                    id={permission.id}
                                    onChange={() => togglePermission(permission.id)}
                                    checked={selectedCheckbox.includes(permission.id)}
                                  />
                                }
                              />
                            ))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

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
          </form >
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
                  Name: {getAccountValues().first_name} {getAccountValues().last_name}
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  Email: {getAccountValues().email}
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  Phone: {getAccountValues().phone}
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  Position: {storePositions.positions?.find(position => position.id === getAccountValues().position)?.name}
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
                    accountErrors.position ||
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
