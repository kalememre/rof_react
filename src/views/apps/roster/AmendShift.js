// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Box, Grid, Stack } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'

import { DateField, TimeField } from '@mui/x-date-pickers'
import moment from 'moment'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import dayjs from 'dayjs'
import { useDispatch } from 'react-redux'
import { deleteShift, unpublishRoster, updateShift } from 'src/store/apps/roster'



const AmendShift = props => {
    const { open, event, setOpen } = props

    // ** State
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const dispatch = useDispatch()

    const schema = yup.object().shape({
        start: yup.string().required('Start time is required'),
        end: yup.string().required('End time is required'),
    });

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        setValue('start', moment(event?.start))
        setValue('end', moment(event?.end))
    }, [event, setValue])

    const handlerUnpublish = () => {
        dispatch(unpublishRoster(event.id))
            .then((res) => {
                if (!res.error) {
                    handleClose()
                }
            })
    }

    const handlerDeleteShift = () => {
        dispatch(deleteShift(event.id))
            .then((res) => {
                if (!res.error) {
                    handleClose()
                }
            })
    }

    const handlerUpdateShift = (data) => {
        const payload = {
            id: event.id,
            start: new Date(data.start).toISOString(),
            end: new Date(data.end).toISOString()
        }

        dispatch(updateShift(payload))
            .then((res) => {
                if (!res.error) {
                    handleClose()
                }
            })
    }

    return (
        <div>
            {/* <Button variant='outlined' onClick={handleClickOpen}>
                Open dialog
            </Button> */}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='customized-dialog-title'
                sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
                maxWidth='sm'
            >
                <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
                    <Stack direction="row" alignItems="center" justifyContent={'flex-start'}>
                        <Typography variant='h4' component='span'>
                            {event?.title}
                        </Typography>
                        <Box ml={1} sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <Box sx={{
                                borderRadius: 1,
                                bgcolor: event?.backgroundColor,
                                color: 'white',
                                pr: 1,
                                pl: 1,
                            }}>
                                <span style={{
                                    fontSize: '0.72rem',
                                }}>{event?.extendedProps?.position}
                                </span>
                            </Box>
                        </Box>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers sx={{ p: theme => theme.spacing(3) }}>
                    <Grid container spacing={2} sx={{ my: 0.5 }}>
                        <Grid item xs={9}>
                            <Controller
                                name='startDate'
                                control={control}
                                render={({ field }) => (
                                    <DateField
                                        {...field}
                                        label="Start Date"
                                        size='small'
                                        fullWidth
                                        format='DD dddd MMM'
                                        sx={{ '& input': { textAlign: 'left' } }}
                                        disabled={true}
                                        value={dayjs(event?.start)}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Controller
                                name='start'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <TimeField
                                        label="Start Time"
                                        format='HH:mm'
                                        size='small'
                                        value={value}
                                        onChange={onChange}
                                        sx={{ '& input': { textAlign: 'center' } }}
                                        error={errors.start}
                                        helperText={errors.start?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={9}>
                            <Controller
                                name='endDate'
                                control={control}
                                render={({ field }) => (
                                    <DateField
                                        {...field}
                                        label="End Date"
                                        size='small'
                                        fullWidth
                                        format='DD dddd MMM'
                                        sx={{ '& input': { textAlign: 'left' } }}
                                        disabled={true}
                                        value={dayjs(event?.end)}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Controller
                                name='end'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <TimeField
                                        label="End Time"
                                        format='HH:mm'
                                        size='small'
                                        value={value}
                                        onChange={onChange}
                                        sx={{ '& input': { textAlign: 'center' } }}
                                        error={errors.end}
                                        helperText={errors.end?.message}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: theme => { theme.spacing(3) }, mt: 2 }}>
                    <Button onClick={event?.extendedProps.published ? handlerUnpublish : handlerDeleteShift} variant='tonal' color='secondary'>{event?.extendedProps.published ? 'Unpublish' : 'Delete'}</Button>
                    <Button Button onClick={handleSubmit(handlerUpdateShift)} variant='tonal'>Update</Button>
                </DialogActions>
            </Dialog>
        </div >
    )
}

export default AmendShift
