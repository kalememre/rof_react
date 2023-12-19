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
import { updateUser } from 'src/store/apps/user'



const schema = yup.object().shape({
    firstName: yup.string().required('Name field is required'),
    lastName: yup.string().required('Surname field is required'),
    phone: yup.string().required('Phone field is required'),
    email: yup.string().email('Invalid email').required('Email field is required'),
})

const UserDetail = (props) => {
    // ** Props
    const { storeUsers } = props

    // ** Store Vars
    const user = storeUsers?.user

    const defaultValues = {
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
        email: user?.email || '',
    }

    // ** Hooks
    const {
        reset,
        control,
        handleSubmit,
        formState: { errors: errors },
    } = useForm({
        defaultValues: defaultValues,
        resolver: yupResolver(schema)
    })

    // ** Hooks
    const dispatch = useDispatch()

    useEffect(() => {
        reset({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phone: user?.phone || '',
            email: user?.email || '',
        });
    }, [user, reset]);



    const onSubmit = data => {
        const userData = {
            ...data,
            id: user?.id,
        }
        dispatch(updateUser(userData))
    }

    return (
        <Box sx={{ position: 'relative' }}>
            <Card disabled={true}>
                <CardHeader title='User Details' sx={{ pb: 1.5 }} />
                <CardContent>
                    <Typography sx={{ mb: 6, color: 'text.secondary' }}>
                        You can edit the user details here.
                    </Typography>
                    <form key={0} onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={5}>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name='firstName'
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
                                            error={Boolean(errors.firstName)}
                                            {...(errors.firstName && { helperText: errors.firstName.message })}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name='lastName'
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
                                            error={Boolean(errors.lastName)}
                                            {...(errors.lastName && { helperText: errors.lastName.message })}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name='email'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <CustomTextField
                                            fullWidth
                                            type='email'
                                            value={value}
                                            label='Email'
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            error={Boolean(errors.email)}
                                            placeholder='carterleonard@gmail.com'
                                            aria-describedby='stepper-linear--email'
                                            {...(errors.email && { helperText: errors.email.message })}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
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
                open={storeUsers.userLoading}
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

export default UserDetail