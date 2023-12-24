import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAnnouncementById } from 'src/store/apps/announcements';

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
        }
    }, [dispatch, id, router]);

    const storeAnnouncements = useSelector(state => state.storeAnnouncements)
    console.log(storeAnnouncements.announcement);

    return (
        <div>ViewAnnouncement</div>
    )
}

export default ViewAnnouncement