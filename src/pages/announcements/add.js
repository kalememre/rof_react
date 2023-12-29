import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import PageHeader from 'src/@core/components/page-header'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import EditorControlled from 'src/views/apps/announcements/EditorControlled'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import AddCard from 'src/views/apps/announcements/AddCard'
import AddActions from 'src/views/apps/announcements/AddActions'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { addAnnouncement } from 'src/store/apps/announcements'
import { useDispatch, useSelector } from 'react-redux'
import { getBranches } from 'src/store/apps/branch'
import { getPositions } from 'src/store/apps/position'
import { useRouter } from 'next/router'

const AddAnnouncement = () => {
    const router = useRouter()

    const defaultAccountValues = {
        position: [],
        branch: [],
        title: '',
        description: '',
        includeUsersOnVacation: false
    }

    const accountSchema = yup.object().shape({
        title: yup.string().required('Title field is required'),
        description: yup.string().required('Description field is required'),
        position: yup.array().min(1, 'Position field is required'),
        branch: yup.array().min(1, 'Branch field is required'),
    })

    // ** State
    const [branch, setBranch] = useState([])
    const [position, setPosition] = useState([])
    const [includeUsersOnVacation, setIncludeUsersOnVacation] = useState(false)


    // ** Hooks
    const {
        reset: accountReset,
        control: accountControl,
        handleSubmit: handleAccountSubmit,
        setValue: setValueAccount,
        trigger: triggerAccount,
        getValues: getAccountValues,
        formState: { errors: accountErrors },
        setError: setAccountError
    } = useForm({
        defaultValues: defaultAccountValues,
        resolver: yupResolver(accountSchema)
    })

    // ** Hooks
    const dispatch = useDispatch()
    const storeBranches = useSelector(state => state.storeBranches)
    const storePositions = useSelector(state => state.storePositions)
    const storeAnnouncements = useSelector(state => state.storeAnnouncements)

    useEffect(() => {
        dispatch(getBranches())
        dispatch(getPositions())
    }, [dispatch])

    const handleChangeRadio = event => {
        setIncludeUsersOnVacation(event.target.value === 'true');
        setValueAccount('includeUsersOnVacation', event.target.value === 'true');
    }

    const onSubmit = data => {
        const finalData = {
            branches: data.branch.map(branch => branch.id),
            positions: data.position.map(position => position.id),
            title: data.title,
            description: data.description,
            includeUsersOnVacation: includeUsersOnVacation
        }

        const result = dispatch(addAnnouncement(finalData))
        result.then(res => {
            if (!res.error) {
                router.push(`${res.payload.id}`)
            }
        })
    }

    return (
        <EditorWrapper>
            <Grid container spacing={6} className='match-height'>
                <PageHeader
                    title={
                        <Typography variant='h4'>
                            Add Announcement
                        </Typography>
                    }
                    subtitle={<Typography sx={{ color: 'text.secondary' }}>You can add new announcement here</Typography>}
                />
                <Grid item xl={9} md={8} xs={12}>
                    <AddCard
                        accountErrors={accountErrors}
                        accountControl={accountControl}
                        setAccountError={setAccountError}
                        setValueAccount={setValueAccount}
                    />
                </Grid>
                <Grid item xl={3} md={4} xs={12}>
                    <AddActions
                        storeBranches={storeBranches}
                        storePositions={storePositions}
                        accountErrors={accountErrors}
                        position={position}
                        setPosition={setPosition}
                        setValueAccount={setValueAccount}
                        triggerAccount={triggerAccount}
                        branch={branch}
                        setBranch={setBranch}
                        includeUsersOnVacation={includeUsersOnVacation}
                        handleChangeRadio={handleChangeRadio}
                        onSubmit={onSubmit}
                        handleAccountSubmit={handleAccountSubmit}
                        storeAnnouncements={storeAnnouncements}

                    />
                </Grid>
            </Grid>
        </EditorWrapper>
    )
}

AddAnnouncement.acl = {
    action: true,
    subject: 'CAN_ADD_ANNOUNCEMENT'
}

export default AddAnnouncement