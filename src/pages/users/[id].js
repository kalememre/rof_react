import { Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router';
import React from 'react'
import PageHeader from 'src/@core/components/page-header'
import TabsCustomized from 'src/views/apps/user/view/TabsCustomized';
import UserViewLeft from 'src/views/apps/user/view/UserViewLeft';

const ViewUser = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <Grid container spacing={4}>
            <Grid item xs={12} md={5} lg={4}>
                <UserViewLeft id={id} />
            </Grid>
            <Grid item xs={12} md={7} lg={8}>
                <TabsCustomized />
            </Grid>
        </Grid>
    )
}

ViewUser.acl = {
    action: true,
    subject: 'can_see_branch_users'
}

export default ViewUser