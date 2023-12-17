import { Backdrop, Box, Card, CardContent, CardHeader, CircularProgress, Typography } from '@mui/material'
import React from 'react'
import SelectAllTransferList from './SelectAllTransferList'
import { useSelector } from 'react-redux'

const UserBranches = (props) => {
    // ** Props
    const { storeUsers } = props
    const user = storeUsers?.user

    const storeBranches = useSelector(state => state.storeBranches)

    return (
        <Box sx={{ position: 'relative' }}>
            <Card disabled={true}>
                <CardHeader title='User Branches' sx={{ pb: 1.5 }} />
                <CardContent>
                    <Typography sx={{ mb: 6, color: 'text.secondary' }}>
                        You can edit the user branches here.
                    </Typography>
                    <SelectAllTransferList storeUsers={storeUsers} />
                </CardContent>
            </Card>
            <Backdrop
                open={storeUsers.userLoading || storeBranches.branchesLoading}
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

export default UserBranches