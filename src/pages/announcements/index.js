import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAnnouncements, getAnnouncementsForUser } from 'src/store/apps/announcements'

const Announcements = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getAnnouncementsForUser())
    }, [dispatch])

    const storeAnnouncements = useSelector(state => state.storeAnnouncements)

    console.log('storeAnnouncements', storeAnnouncements);

    return (
        <div>Announcements</div>
    )
}

export default Announcements