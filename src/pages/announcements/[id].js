import { Grid, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PageHeader from 'src/@core/components/page-header';
import { Roles } from 'src/Roles';
import { getAnnouncementById } from 'src/store/apps/announcements';
import { getBranches } from 'src/store/apps/branch';
import { getPositions } from 'src/store/apps/position';
import PreviewActions from 'src/views/apps/announcements/PreviewActions';
import PreviewCard from 'src/views/apps/announcements/PreviewCard';

const ViewAnnouncement = () => {
    const router = useRouter();
    const { id } = router.query;



    const dispatch = useDispatch()

    useEffect(() => {
        if (id) {
            dispatch(getAnnouncementById(id))
                .then((response) => {
                    if (!response.payload) {
                        router.push('/404');
                    }
                });
            dispatch(getPositions());
            dispatch(getBranches());
        }
    }, [dispatch, id, router]);

    const storeAnnouncements = useSelector(state => state.storeAnnouncements)
    const storePositions = useSelector(state => state.storePositions)
    const storeBranches = useSelector(state => state.storeBranches)

    return (
        <Grid container spacing={6}>
            <PageHeader
                title={
                    <Typography variant='h4'>
                        View Announcement
                    </Typography>
                }
                subtitle={<Typography sx={{ color: 'text.secondary' }}>You can view announcement here</Typography>}
            />
            <Grid item xl={9} md={8} xs={12}>
                <PreviewCard storeAnnouncements={storeAnnouncements} />
            </Grid>
            <Grid item xl={3} md={4} xs={12}>
                <PreviewActions
                    storePositions={storePositions}
                    storeBranches={storeBranches}
                    storeAnnouncements={storeAnnouncements}
                />
            </Grid>
        </Grid>
    )
}

ViewAnnouncement.acl = {
    action: true,
    subject: Roles.CAN_CREATE_ANNOUNCEMENT
}

export default ViewAnnouncement