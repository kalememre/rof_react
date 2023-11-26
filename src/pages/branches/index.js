import { Button, Grid, Link, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PageHeader from 'src/@core/components/page-header'
import { getBranches } from 'src/store/apps/branch'
import TableFilter from 'src/views/apps/branches/TableFilter'
import { styled } from '@mui/material/styles'
import CreateBranch from 'src/views/apps/branches/CreateBranch'



const Branch = () => {
    const dispatch = useDispatch()
    const storeBranches = useSelector(state => state.storeBranches)
    const [show, setShow] = useState(false)

    useEffect(() => {
        dispatch(getBranches())
    }, [dispatch])

    const handleShow = () => {
        setShow(true)
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <PageHeader
                    title={
                        <Typography variant='h4'>
                            Branches
                        </Typography>
                    }
                    subtitle={
                        <Typography sx={{ color: 'text.secondary' }}>
                            You can view and manage branches here.
                        </Typography>
                    }

                />
            </Grid>
            <Grid item xs={6} sx={{
                alignSelf: 'center',
                textAlign: 'right'
            }}>
                <Button onClick={handleShow} variant="contained">
                    Create Branch
                </Button>
            </Grid>
            <Grid item xs={12}>
                <TableFilter storeBranches={storeBranches} />
            </Grid>
            <CreateBranch title={'Create'} show={show} setShow={setShow} />
        </Grid>
    )
}

export default Branch