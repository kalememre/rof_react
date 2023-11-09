// ** React Imports
import { Fragment } from 'react'

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


const DialogConfirmation = props => {
    // ** Props
    const { open, setOpen, eventId, setShow } = props

    const handleClose = () => {
        setOpen(false)
    }

    // ** State
    const { holidayLoading } = props
    const dispatch = useDispatch()

    const handleSubmit = () => {
        dispatch(patchHoliday(eventId))
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
                <DialogTitle id='alert-dialog-title'>{'Approve Holiday'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        Are you sure you want to approve this holiday?
                        <br />
                        It won't be possible to undo this action
                    </DialogContentText>
                </DialogContent>
                <DialogActions className='dialog-actions-dense'>
                    <Button
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
