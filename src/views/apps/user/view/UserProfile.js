import { Backdrop, Box, Button, Card, CardContent, CardHeader, CircularProgress, Grid, MenuItem, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Custom Component Import
import CustomChip from 'src/@core/components/mui/chip'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useDispatch, useSelector } from 'react-redux'
import { getPositions } from 'src/store/apps/position'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { CircleFlag } from 'react-circle-flags'

// ** Data
import { countries } from 'src/@fake-db/autocomplete'
import { updateUserProfile } from 'src/store/apps/user'


const schema = yup.object().shape({
    positionId: yup.string().required('Position field is required'),
})

const UserProfile = (props) => {
    // ** Props
    const { storeUsers } = props

    // ** Store Vars
    const user = storeUsers?.user

    const defaultValues = {
        positionId: user?.userProfile?.position.id || '',
        country: user?.userProfile?.country || '',
        ppsn: user?.userProfile?.ppsn || '',
        passport: user?.userProfile?.passport || '',
    }

    // ** Hooks
    const {
        reset,
        control,
        handleSubmit,
        setValue,
        trigger,
        getValues,
        formState: { errors: errors },
        setError
    } = useForm({
        defaultValues: defaultValues,
        resolver: yupResolver(schema)
    })

    // ** State
    const [country, setCountry] = useState('')

    // ** Hooks
    const dispatch = useDispatch()
    const storePositions = useSelector(state => state.storePositions)

    useEffect(() => {
        dispatch(getPositions())
    }, [dispatch, user?.isActive])

    useEffect(() => {
        reset();
        reset({
            positionId: user?.userProfile?.position.id || '',
            country: user?.userProfile?.country || '',
            ppsn: user?.userProfile?.ppsn || '',
            passport: user?.userProfile?.passport || '',
        });
    }, [user, reset]);

    const handleCountryChange = (event, value) => {
        setCountry(value)
        setValue('country', value?.code ?? '')
        trigger('country')
    }



    const onSubmit = data => {
        const userData = {
            ...data,
            id: user?.id,
        }
        dispatch(updateUserProfile(userData))
    }

    return (
        <Box sx={{ position: 'relative' }}>
            <Card>
                <CardHeader title='Additional Information' sx={{ pb: 1.5 }} />
                <CardContent>
                    <Typography sx={{ mb: 6, color: 'text.secondary' }}>
                        You can edit the user information here.
                    </Typography>
                    <form key={0} onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={5}>
                            <Grid item sm={6} xs={12}>
                                <Controller
                                    name='positionId'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <CustomTextField
                                            select
                                            fullWidth
                                            label='Position'
                                            sx={{ mb: 2 }}
                                            disabled={storePositions.loading}
                                            defaultValue='Select Position'
                                            error={Boolean(errors.positionId)}
                                            {...(errors.positionId && { helperText: errors.positionId.message })}
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
                                <Controller
                                    name='country'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <CustomTextField
                                            select
                                            fullWidth
                                            label='Country'
                                            id='country'
                                            sx={{
                                                mb: 2,
                                                '& .MuiSelect-select': {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                },
                                            }}
                                            defaultValue='Select Country'
                                            error={Boolean(errors.country)}
                                            {...(errors.country && { helperText: errors.country.message })}
                                            SelectProps={{
                                                value: value,
                                                displayEmpty: true,
                                                onChange: onChange,
                                                MenuProps: {
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 300, // İstediğiniz yükseklik değerini buradan ayarlayabilirsiniz
                                                        },
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem selected disabled value=''><em>Select Country</em></MenuItem>
                                            {countries.map((position, index) => (
                                                <MenuItem key={index} value={position.code}>
                                                    {/* <CircleFlag countryCode={position.code.toLowerCase()} height='20' /> */}
                                                    <img src={`/flags/${position.code.toLowerCase()}.svg`} alt={position.label} height='24' />
                                                    <span style={{ marginLeft: 10 }}>
                                                        {position.label}
                                                    </span>
                                                </MenuItem>
                                            ))}
                                        </CustomTextField>
                                    )}
                                />
                            </Grid>
                            <Grid item sm={6} xs={12}>
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
                            <Grid item sm={6} xs={12}>
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
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button type='submit' variant='contained' disabled={!user.isActive}>
                                    Save Changes
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
            <Backdrop
                open={storePositions.positionLoading || storeUsers.userProfileLoading}
                sx={{
                    position: 'absolute',
                    color: 'common.white',
                    zIndex: theme => theme.zIndex.mobileStepper - 1,
                    borderRadius: '6px !important',
                }}
            >
                <CircularProgress color='inherit' />
            </Backdrop>
            <Backdrop
                open={!user.isActive}
                sx={{
                    position: 'absolute',
                    color: 'primary.main',
                    zIndex: theme => theme.zIndex.mobileStepper - 1,
                    borderRadius: '6px !important',
                    opacity: '0.5 !important'
                }}
            />
        </Box>
    )
}

export default UserProfile