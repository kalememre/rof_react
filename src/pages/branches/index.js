import { Button, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PageHeader from 'src/@core/components/page-header'
import { getBranches } from 'src/store/apps/branch'
import TableFilter from 'src/views/apps/branches/TableFilter'
import CreateBranch from 'src/views/apps/branches/CreateBranch'



const Branch = () => {
    const dispatch = useDispatch()
    const storeBranches = useSelector(state => state.storeBranches)

    useEffect(() => {
        dispatch(getBranches())
    }, [dispatch])

    const [addBranchOpen, setAddBranchOpen] = useState(false)

    const toggleAddBranchDrawer = () => setAddBranchOpen(!addBranchOpen)

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
                <Button onClick={toggleAddBranchDrawer} variant="contained">
                    Create Branch
                </Button>
            </Grid>
            <Grid item xs={12}>
                <TableFilter storeBranches={storeBranches} />
            </Grid>
            <CreateBranch title={'Create'} open={addBranchOpen} toggle={toggleAddBranchDrawer} />
        </Grid>
    )
}

export default Branch