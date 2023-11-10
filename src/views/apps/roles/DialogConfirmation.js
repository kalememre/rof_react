// ** React Imports
import { Fragment } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { FormHelperText, LinearProgress } from '@mui/material'
import { useDispatch } from 'react-redux'
import { patchHoliday } from 'src/store/apps/holidays'
import { deleteRole } from 'src/store/apps/user'


const DialogConfirmation = props => {
    // ** Props
    const { confirmDelete, setConfirmDelete, roleId, storeUsers } = props

    const handleClose = () => {
        setConfirmDelete(false)
    }

    // ** State
    const dispatch = useDispatch()

    const handleSubmit = () => {
        dispatch(deleteRole(roleId))
        handleClose()
    }

    return (
        <Fragment>
            <Dialog
                open={confirmDelete}
                disableEscapeKeyDown
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        handleClose()
                    }
                }}
            >
                <DialogTitle id='alert-dialog-title'>{'Delete Role'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        Are you sure you want to delete this role?
                        <br />
                        It won't be possible to undo this action
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
