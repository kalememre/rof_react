// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stepper from '@mui/material/Stepper'
import MenuItem from '@mui/material/MenuItem'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiStep from '@mui/material/Step'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import StepperCustomDot from './StepperCustomDot'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Styled Component
import StepperWrapper from 'src/@core/styles/mui/stepper'

import { useCallback, useEffect } from 'react'
import PageHeader from 'src/@core/components/page-header'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'

// ** Custom Component Import
import CustomChip from 'src/@core/components/mui/chip'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Data
import { countries } from 'src/@fake-db/autocomplete'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'
import { InputLabel } from '@mui/material'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { CircleFlag } from 'react-circle-flags'
import { getBranches } from 'src/store/apps/branch'
import { getRoles } from 'src/store/apps/role'

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

const schemaPerson = yup.object().shape({
  // name: yup.string().required('Name field is required'),
  // surname: yup.string().required('Surname field is required'),
  // phone: yup.string().required('Phone field is required'),
  // email: yup.string().email('Invalid email').required('Email field is required'),
  // role: yup.string().required('Role field is required'),
  branch: yup.array().min(1, 'Branch field is required'),
})

const schemaExtra = yup.object().shape({
  // country: yup.string().required('Country field is required'),
  // ppsn: yup.string().required('PPSN field is required'),
  // passport: yup.string().required('Passport field is required'),
})

const schemaPermission = yup.object().shape({
  // name: yup.string().required('Name field is required'),
})

const defaultValuesPerson = {
  name: '',
  surname: '',
  phone: '',
  email: '',
  role: '',
  branch: []
}

const defaultValuesExtra = {
  country: '',
  ppsn: '',
  passport: '',
}

const defaultValuesPermission = {
  name: '',
}

const steps = [
  {
    icon: 'tabler:home',
    title: 'Account Details',
    subtitle: 'Enter your Account Details'
  },
  {
    icon: 'tabler:user',
    title: 'Personal Info',
    subtitle: 'Setup Information'
  },
  {
    icon: 'tabler:link',
    title: 'Social Links',
    subtitle: 'Add Social Links'
  }
]

const Step = styled(MuiStep)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  '&:first-of-type': {
    paddingLeft: 0
  },
  '&:last-of-type': {
    paddingRight: 0
  },
  '& .MuiStepLabel-iconContainer': {
    display: 'none'
  },
  '& .step-subtitle': {
    color: `${theme.palette.text.disabled} !important`
  },
  '& + svg': {
    color: theme.palette.text.disabled
  },
  '&.Mui-completed .step-title': {
    color: theme.palette.text.disabled
  },
  '&.Mui-completed + svg': {
    color: theme.palette.primary.main
  },
  [theme.breakpoints.down('md')]: {
    padding: 0,
    ':not(:last-of-type)': {
      marginBottom: theme.spacing(6)
    }
  }
}))

const StepperCustomHorizontal = () => {

  // ** State
  const [branch, setBranch] = useState([])
  const [activeStep, setActiveStep] = useState(0)


  const handleRoleChange = useCallback(e => {
    setRole(e.target.value)
  }, [])

  // ** Hooks
  const dispatch = useDispatch()
  const storeBranches = useSelector(state => state.storeBranches)
  const storeRoles = useSelector(state => state.storeRoles)

  useEffect(() => {
    dispatch(getBranches())
    dispatch(getRoles())
  }, [dispatch])

  // ** Hooks
  const {
    reset: resetPerson,
    control: controlPerson,
    setValue: setValuePerson,
    handleSubmit: handleSubmitPerson,
    trigger: triggerPerson,
    formState: { errors: errorsPerson }
  } = useForm({
    defaultValues: defaultValuesPerson,
    resolver: yupResolver(schemaPerson)
  })

  const {
    reset: resetExtra,
    control: controlExtra,
    handleSubmit: handleSubmitExtra,
    formState: { errors: errorsExtra }
  } = useForm({
    defaultValues: defaultValuesExtra,
    resolver: yupResolver(schemaExtra)
  })

  const {
    reset: resetPermission,
    control: controlPermission,
    handleSubmit: handleSubmitPermission,
    formState: { errors: errorsPermission }
  } = useForm({
    defaultValues: defaultValuesPermission,
    resolver: yupResolver(schemaPermission)
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

  // ** Hooks & Var
  const { settings } = useSettings()
  const smallScreen = useMediaQuery(theme => theme.breakpoints.down('md'))
  const { direction } = settings

  // Handle Stepper
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
    if (activeStep === steps.length - 1) {
      toast.success('Form Submitted')
    }
  }

  const handleReset = () => {
    setActiveStep(0)
  }


  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <form key={0} onSubmit={handleSubmitPerson(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Controller
                  name='name'
                  control={controlPerson}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      sx={{ mb: 2 }}
                      label='Name'
                      onChange={onChange}
                      placeholder="Enter user's name"
                      error={Boolean(errorsPerson.name)}
                      {...(errorsPerson.name && { helperText: errorsPerson.name.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name='surname'
                  control={controlPerson}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      sx={{ mb: 2 }}
                      label='Surname'
                      onChange={onChange}
                      placeholder="Enter user's surname"
                      error={Boolean(errorsPerson.surname)}
                      {...(errorsPerson.surname && { helperText: errorsPerson.surname.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name='phone'
                  control={controlPerson}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label='Phone'
                      value={value}
                      sx={{ mb: 2 }}
                      onChange={onChange}
                      error={Boolean(errorsPerson.phone)}
                      placeholder='Enter user phone'
                      {...(errorsPerson.phone && { helperText: errorsPerson.phone.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name='email'
                  control={controlPerson}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      type='email'
                      label='Email'
                      value={value}
                      sx={{ mb: 2 }}
                      onChange={onChange}
                      error={Boolean(errorsPerson.email)}
                      placeholder='johndoe@email.com'
                      {...(errorsPerson.email && { helperText: errorsPerson.email.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <Controller
                  name='role'
                  control={controlPerson}
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
                      error={Boolean(errorsPerson.role)}
                      {...(errorsPerson.role && { helperText: errorsPerson.role.message })}
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
                  error={Boolean(errorsPerson.branch)}
                  {...(errorsPerson.branch && { helperText: errorsPerson.branch.message })}
                  SelectProps={{
                    MenuProps,
                    multiple: true,
                    value: branch,
                    onChange: e => {
                      setBranch(e.target.value)
                      setValuePerson('branch', e.target.value)
                      triggerPerson('branch')
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
          </form>
        )
      case 1:
        return (
          <form key={1} onSubmit={handleSubmitExtra(onSubmit)}>
            <Grid container spacing={3}>

            </Grid>
          </form>
        )
      case 2:
        return (
          <form key={2} onSubmit={handleSubmitPermission(onSubmit)}>
            <Grid container spacing={3}>

            </Grid>
          </form>
        )
      default:
        return 'Unknown Step'
    }
  }

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <>
          <Typography>All steps are completed!</Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant='contained' onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </>
      )
    } else {
      return (
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                {steps[activeStep].title}
              </Typography>
              <Typography variant='caption' component='p'>
                {steps[activeStep].subtitle}
              </Typography>
            </Grid>
            {getStepContent(activeStep)}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant='tonal' color='secondary' disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
              <Button variant='contained' type='submit'>
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </Grid>
          </Grid>
        </form>
      )
    }
  }

  return (
    <Card>
      <CardContent>
        <StepperWrapper>
          <Stepper
            activeStep={activeStep}
            connector={
              !smallScreen ? <Icon icon={direction === 'ltr' ? 'tabler:chevron-right' : 'tabler:chevron-left'} /> : null
            }
          >
            {steps.map((step, index) => {
              const RenderAvatar = activeStep >= index ? CustomAvatar : Avatar

              return (
                <Step key={index}>
                  <StepLabel StepIconComponent={StepperCustomDot}>
                    <div className='step-label'>
                      <RenderAvatar
                        variant='rounded'
                        {...(activeStep >= index && { skin: 'light' })}
                        {...(activeStep === index && { skin: 'filled' })}
                        {...(activeStep >= index && { color: 'primary' })}
                        sx={{
                          ...(activeStep === index && { boxShadow: theme => theme.shadows[3] }),
                          ...(activeStep > index && { color: theme => hexToRGBA(theme.palette.primary.main, 0.4) })
                        }}
                      >
                        <Icon icon={step.icon} />
                      </RenderAvatar>
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

export default StepperCustomHorizontal
