import { Backdrop, Box, Card, CardContent, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import React from 'react'
import { useTheme } from '@mui/material/styles'

const CardActionsRefresh = props => {
    // ** Props
    const { branches, userLoading, storeHolidays, selectBranch } = props

    // ** Hooks
    const theme = useTheme()

    return (
        <Box sx={{ position: 'relative', mb: 1 }}>
            <CardContent>

                <Typography variant='h5' sx={{ mb: 0.5 }}>
                    Filter Holidays by Branch
                </Typography>
                <Typography sx={{ mb: 3, color: 'text.secondary' }}>
                    Select a branch to view its holidays
                </Typography>

                <FormControl sx={{ width: '100%' }}>
                    <InputLabel id='demo-simple-select-outlined-label'>
                        {userLoading ? 'Loading...' : 'Select Branch'}
                    </InputLabel>
                    <Select
                        label='Select Branch'
                        defaultValue=''
                        id='select_branch'
                        labelId='select_branch-label'
                        onChange={selectBranch}
                        disabled={userLoading}
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

            </CardContent>
            <Backdrop
                open={userLoading || storeHolidays.holidayLoading}
                sx={{
                    position: 'absolute',
                    color: 'common.white',
                    zIndex: theme => theme.zIndex.mobileStepper - 1
                }}
            >
                <CircularProgress color='inherit' />
            </Backdrop>
        </Box>
    )
}

export default CardActionsRefresh