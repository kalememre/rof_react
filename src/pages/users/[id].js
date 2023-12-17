import { Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PageHeader from 'src/@core/components/page-header'
import { getBranches } from 'src/store/apps/branch';
import { getPositions } from 'src/store/apps/position';
import { getUserById } from 'src/store/apps/user';
import TabsCustomized from 'src/views/apps/user/view/TabsCustomized';
import UserViewLeft from 'src/views/apps/user/view/UserViewLeft';

const ViewUser = () => {
    const router = useRouter();
    const { id } = router.query;

    const dispatch = useDispatch()

    useEffect(() => {
        if (id) {
            dispatch(getUserById(id))
                .then((response) => {
                    if (!response.payload) {
                        router.push('/404');
                    }
                });

            // dispatch(getPositions())
            // dispatch(getBranches())

        }
    }, [dispatch, id, router]);

    const storeUsers = useSelector(state => state.storeUsers)

    return (
        <Grid container spacing={4}>
            <Grid item xs={12} md={5} lg={4}>
                <UserViewLeft storeUsers={storeUsers} />
            </Grid>
            <Grid item xs={12} md={7} lg={8}>
                <TabsCustomized storeUsers={storeUsers} />
            </Grid>
        </Grid>
    )
}

ViewUser.acl = {
    action: true,
    subject: 'can_see_branch_users'
}

export default ViewUser