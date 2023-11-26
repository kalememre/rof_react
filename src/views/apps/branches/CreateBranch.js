// ** React Imports
import { useState, forwardRef, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Switch from '@mui/material/Switch'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import { addBranch, updateBranch } from 'src/store/apps/branch'

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

const CreateBranch = props => {
    const { show, setShow, title, row } = props



    // ** States
    const dispatch = useDispatch()

    const schema = yup.object().shape({
        name: yup.string().required('Branch Name is required'),
    })

    const defaultValues = {
        name: '',
        phone: '',
        email: '',
        address: ''
    }

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

    useEffect(() => {
        if (row) {
            setValue('name', row?.name || '');
            setValue('phone', row?.branch_detail?.phone || '');
            setValue('email', row?.branch_detail?.email || '');
            setValue('address', row?.branch_detail?.address || '');
        }
    }, [row, setValue]);

    const onSubmit = data => {
        if (title === 'Create') {
            const branch = {
                name: data.name,
                branch_detail: {
                    phone: data.phone,
                    email: data.email,
                    address: data.address
                }
            }
            dispatch(addBranch(branch))
                .then((res) => {
                    if (!res.error) {
                        setShow(false)
                        reset()
                    }
                })
        } else {
            const branch = {
                id: row.id,
                name: data.name,
                branch_detail: {
                    phone: data.phone,
                    email: data.email,
                    address: data.address
                }
            }
            dispatch(updateBranch(branch))
                .then((res) => {
                    if (!res.error) {
                        setShow(false)
                        reset()
                    }
                })
        }

    }


    return (
        <Dialog
            fullWidth
            open={show}
            maxWidth='xs'
            scroll='body'
            onClose={() => setShow(false)}
            TransitionComponent={Transition}
            sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        >
            <DialogContent
                sx={{
                    pb: theme => `${theme.spacing(8)} !important`,
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                    pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
            >
                <CustomCloseButton onClick={() => setShow(false)}>
                    <Icon icon='tabler:x' fontSize='1.25rem' />
                </CustomCloseButton>
                <Box sx={{ mb: 8, textAlign: 'center' }}>
                    <Typography variant='h3' sx={{ mb: 3 }}>
                        {title} Branch
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                        You can {title} branch here.
                    </Typography>
                </Box>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Controller
                            name='name'
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
                                    label='Branch Name'
                                    placeholder='Enter Branch Name'
                                    error={Boolean(errors.name)}
                                    {...(errors.name && { helperText: errors.name.message })}
                                />

                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name='phone'
                            control={control}
                            render={({ field: { value, onChange, onBlur } }) => (
                                <CustomTextField
                                    fullWidth
                                    control={control}
                                    rules={{ required: true }}
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    label='Branch Phone'
                                    placeholder='Enter Branch Phone'
                                    error={Boolean(errors.phone)}
                                    {...(errors.phone && { helperText: errors.phone.message })}
                                />

                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name='email'
                            type='email'
                            control={control}
                            render={({ field: { value, onChange, onBlur } }) => (
                                <CustomTextField
                                    fullWidth
                                    control={control}
                                    type='email'
                                    rules={{ required: true }}
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    label='Branch Email'
                                    placeholder='Enter Branch Email'
                                    error={Boolean(errors.email)}
                                    {...(errors.email && { helperText: errors.email.message })}
                                />

                            )}
                        />
                    </Grid>
                    <Grid item sm={12} xs={12}>
                        <Controller
                            name='address'
                            control={control}
                            render={({ field: { value, onChange, onBlur } }) => (
                                <CustomTextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    control={control}
                                    rules={{ required: true }}
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    label='Branch Address'
                                    placeholder='Enter Branch Address'
                                    error={Boolean(errors.address)}
                                    {...(errors.address && { helperText: errors.address.message })}
                                />

                            )}
                        />
                    </Grid>

                </Grid>
            </DialogContent>
            <DialogActions
                sx={{
                    justifyContent: 'center',
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                    pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
            >
                <Button variant='tonal' color='secondary' onClick={() => setShow(false)}>
                    Cancel
                </Button>
                <Button variant='outlined' sx={{ mr: 1 }} onClick={handleSubmit(onSubmit)}>
                    {title}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CreateBranch