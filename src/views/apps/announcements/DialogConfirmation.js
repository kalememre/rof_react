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
import { deleteBranch } from 'src/store/apps/branch'


const DialogConfirmation = props => {
    // ** Props
    const {
        confirmAdd,
        setConfirmAdd,
        handleAccountSubmit,
        onSubmit,
        storeAnnouncements
    } = props

    const handleClose = () => {
        setConfirmAdd(false)
    }

    return (
        <Fragment>
            <Dialog
                open={confirmAdd}
                disableEscapeKeyDown
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        handleClose()
                    }
                }}
            >
                <DialogTitle id='alert-dialog-title'>{'Add Announcement'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        Are you sure you want to continue?
                        <br />
                        It won't be possible to undo this action
                    </DialogContentText>
                </DialogContent>
                <DialogActions className='dialog-actions-dense'>
                    <Button
                        disabled={storeAnnouncements.branchLoading}
                        onClick={handleClose}>Cancel</Button>
                    <Button
                        disabled={storeAnnouncements.branchLoading}
                        onClick={handleAccountSubmit(onSubmit)}>Submit</Button>
                </DialogActions>
                {storeAnnouncements.announcementLoading && <LinearProgress color='error' />}
            </Dialog>
        </Fragment>
    )
}

export default DialogConfirmation
