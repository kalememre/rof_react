import { Grid } from '@mui/material'
import React from 'react'
import UserDetail from './UserDetail'
import UserProfile from './UserProfile'
import UserBranches from './UserBranches'

const UserTab = (props) => {
    const { storeUsers } = props

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <UserDetail storeUsers={storeUsers} />
            </Grid>
            <Grid item xs={12}>
                <UserProfile storeUsers={storeUsers} />
            </Grid>
            <Grid item xs={12}>
                <UserBranches storeUsers={storeUsers} />
            </Grid>
        </Grid>
    )
}

export default UserTab