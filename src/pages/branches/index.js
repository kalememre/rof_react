import { Grid, Link, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PageHeader from 'src/@core/components/page-header'
import { getBranches } from 'src/store/apps/branch'
import TableFilter from 'src/views/apps/branches/TableFilter'
import { styled } from '@mui/material/styles'

const LinkStyled = styled(Link)(({ theme }) => ({
    textDecoration: 'none',
    color: theme.palette.primary.main
}))


const Branch = () => {
    const dispatch = useDispatch()
    const storeBranches = useSelector(state => state.storeBranches)

    useEffect(() => {
        dispatch(getBranches())
    }, [dispatch])

    return (
        <Grid container spacing={6}>
            <PageHeader
                title={
                    <Typography variant='h4'>
                        <LinkStyled href='https://mui.com/x/react-data-grid/' target='_blank'>
                            Branches
                        </LinkStyled>
                    </Typography>
                }
                subtitle={
                    <Typography sx={{ color: 'text.secondary' }}>
                        You can view and manage branches here.
                    </Typography>
                }
            />
            <Grid item xs={12}>
                <TableFilter storeBranches={storeBranches} />
            </Grid>
        </Grid>
    )
}

export default Branch