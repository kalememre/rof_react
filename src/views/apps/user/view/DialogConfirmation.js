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
import { suspendUser } from 'src/store/apps/user'


const DialogConfirmation = props => {
    // ** Props
    const { suspendDialogOpen, setSuspendDialogOpen, id, storeUsers } = props

    const handleClose = () => {
        setSuspendDialogOpen(false)
    }

    // ** State
    const dispatch = useDispatch()

    const handleSubmit = () => {
        dispatch(suspendUser(id))
            .then((res) => {
                if (!res.error) {
                    handleClose()
                }
            })
    }

    return (
        <Fragment>
            <Dialog
                open={suspendDialogOpen}
                disableEscapeKeyDown
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        handleClose()
                    }
                }}
            >
                <DialogTitle id='alert-dialog-title'>{'Confirmation'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        Are you sure you want to suspend this user?
                    </DialogContentText>
                </DialogContent>
                <DialogActions className='dialog-actions-dense'>
                    <Button
                        disabled={storeUsers.userLoading}
                        onClick={handleClose}>Cancel</Button>
                    <Button
                        disabled={storeUsers.userLoading}
                        onClick={handleSubmit}>Submit</Button>
                </DialogActions>
                {storeUsers.userLoading && <LinearProgress color='error' />}
            </Dialog>
        </Fragment>
    )
}

export default DialogConfirmation
