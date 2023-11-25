// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { LinearProgress } from '@mui/material'
import { useDispatch } from 'react-redux'
import { patchHoliday } from 'src/store/apps/holidays'
import CustomTextField from 'src/@core/components/mui/text-field'


const DialogConfirmation = props => {
    // ** Props
    const { open, setOpen, eventId, setShow, process, holidayLoading } = props
    const approved = process === 'approve'

    const handleClose = () => {
        setOpen(false)
        setReason('')
    }

    // ** State
    const [reason, setReason] = useState('')
    const dispatch = useDispatch()

    const handleSubmit = () => {
        dispatch(patchHoliday({ id: eventId, process, processed_reason: reason }))
        handleClose()
        setShow(false)
    }

    return (
        <Fragment>
            <Dialog
                open={open}
                disableEscapeKeyDown
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        handleClose()
                    }
                }}
            >
                <DialogTitle id='alert-dialog-title'>{'Confirm'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        Are you sure you want to <code style={{ color: approved ? 'green' : 'red' }}>{process}</code> this holiday?
                        <br />
                        It won't be possible to undo this action
                    </DialogContentText>
                    {!approved &&
                        <CustomTextField
                            sx={{ mt: 5 }}
                            fullWidth
                            label='Reason'
                            multiline
                            rows={4}
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                        />}
                </DialogContent>
                <DialogActions className='dialog-actions-dense'>
                    <Button
                        color='secondary'
                        disabled={holidayLoading}
                        onClick={handleClose}>Cancel</Button>
                    <Button
                        disabled={holidayLoading}
                        onClick={handleSubmit}>Submit</Button>
                </DialogActions>
                {holidayLoading && <LinearProgress color='error' />}
            </Dialog>
        </Fragment>
    )
}

export default DialogConfirmation
