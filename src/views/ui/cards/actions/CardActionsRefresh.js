import { Backdrop, Card, CardContent, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import React from 'react'
import { useTheme } from '@mui/material/styles'

const CardActionsRefresh = props => {
    // ** Props
    const { branches, isLoading, store, selectBranch } = props

    // ** Hooks
    const theme = useTheme()

    return (
        <Card sx={{ position: 'relative', mb: 1 }}>
            <CardContent>
                <Grid container>

                    <Grid
                        item
                        xs={12}
                        sm={8}>

                        <Typography variant='h5' sx={{ mb: 0.5 }}>
                            Filter Leaves by Branch
                        </Typography>
                        <Typography sx={{ mb: 3, color: 'text.secondary' }}>
                            Select a branch to view its leaves.
                        </Typography>

                        <FormControl sx={{ width: '75%' }}>
                            <InputLabel id='demo-simple-select-outlined-label'>
                                {isLoading ? 'Loading...' : 'Select Branch'}
                            </InputLabel>
                            <Select
                                label='Select Branch'
                                defaultValue=''
                                id='select_branch'
                                labelId='select_branch-label'
                                onChange={selectBranch}
                                disabled={isLoading}
                            >
                                <MenuItem value=''>
                                    <em>None</em>
                                </MenuItem>
                                {branches?.map((branch, index) => (
                                    <MenuItem key={index} value={branch.id}>
                                        {branch.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={4}
                        sx={{
                            order: [1, 2],
                            textAlign: 'center',
                            '& img': {
                                height: '100px !important',
                                maxWidth: 'none !important',
                                [theme.breakpoints.up('xs')]: {
                                    top: '50%',
                                    position: 'absolute',
                                    right: theme.spacing(6),
                                    transform: 'translateY(-50%)'
                                }
                            }
                        }}
                    >
                        <img src='/images/cards/graphic-illustration-2.png' alt='branch' />
                    </Grid>
                </Grid>

            </CardContent>
            <Backdrop
                open={isLoading || store.isLoading}
                sx={{
                    position: 'absolute',
                    color: 'common.white',
                    zIndex: theme => theme.zIndex.mobileStepper - 1
                }}
            >
                <CircularProgress color='inherit' />
            </Backdrop>
        </Card>
    )
}

export default CardActionsRefresh