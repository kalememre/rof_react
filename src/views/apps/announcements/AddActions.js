// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Backdrop, Box, CircularProgress, FormControl, FormControlLabel, Grid, MenuItem, Radio, RadioGroup, Typography } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Custom Component Import
import CustomChip from 'src/@core/components/mui/chip'
import { useState } from 'react'
import DialogConfirmation from './DialogConfirmation'

const AddActions = props => {
    // ** Props
    const {
        storePositions,
        accountErrors,
        position,
        setPosition,
        setValueAccount,
        triggerAccount,
        branch,
        setBranch,
        storeBranches,
        includeUsersOnVacation,
        handleChangeRadio,
        handleAccountSubmit,
        onSubmit,
        storeAnnouncements
    } = props

    const ITEM_HEIGHT = 48
    const ITEM_PADDING_TOP = 8

    const MenuProps = {
        PaperProps: {
            style: {
                width: 250,
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
            }
        }
    }

    const [confirmAdd, setConfirmAdd] = useState(false)

    return (
        <Card sx={{ position: 'relative' }}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextField
                            select
                            fullWidth
                            label='Position'
                            id='select-position-chip'
                            sx={{ mb: 2 }}
                            error={Boolean(accountErrors.position)}
                            {...(accountErrors.position && { helperText: accountErrors.position.message })}
                            SelectProps={{
                                MenuProps,
                                multiple: true,
                                value: position,
                                onChange: e => {
                                    setPosition(e.target.value)
                                    setValueAccount('position', e.target.value)
                                    triggerAccount('position')
                                },
                                renderValue: selected => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {selected.map(value => (
                                            <CustomChip key={value.id} label={value.name} sx={{ m: 0.75 }} skin='light' color='primary' />
                                        ))}
                                    </Box>
                                )
                            }}
                        >
                            {storePositions.positions.map(position => (
                                <MenuItem key={position.id} value={position}>
                                    {position.name}
                                </MenuItem>
                            ))}
                        </CustomTextField>
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextField
                            select
                            fullWidth
                            label='Branch'
                            id='select-branch-chip'
                            sx={{ mb: 2 }}
                            error={Boolean(accountErrors.branch)}
                            {...(accountErrors.branch && { helperText: accountErrors.branch.message })}
                            SelectProps={{
                                MenuProps,
                                multiple: true,
                                value: branch,
                                onChange: e => {
                                    setBranch(e.target.value)
                                    setValueAccount('branch', e.target.value)
                                    triggerAccount('branch')
                                },
                                renderValue: selected => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {selected.map(value => (
                                            <CustomChip key={value.id} label={value.name} sx={{ m: 0.75 }} skin='light' color='primary' />
                                        ))}
                                    </Box>
                                )
                            }}
                        >
                            {storeBranches.branches.map(branch => (
                                <MenuItem key={branch.id} value={branch}>
                                    {branch.name}
                                </MenuItem>
                            ))}
                        </CustomTextField>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Include Users On Holiday?</Typography>
                        <FormControl sx={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                            <RadioGroup
                                row
                                aria-label='controlled'
                                name='includeUsersOnVacation'
                                value={includeUsersOnVacation ? 'true' : 'false'}
                                onChange={handleChangeRadio}
                            >
                                <FormControlLabel value='true' control={<Radio />} label='Yes' />
                                <FormControlLabel value='false' control={<Radio />} label='No' />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            fullWidth
                            color='primary'
                            variant='contained'
                            onClick={() => setConfirmAdd(true)}
                        >Save
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
            <Backdrop
                open={storePositions.positionLoading || storeBranches.branchLoading}
                sx={{
                    position: 'absolute',
                    color: 'common.white',
                    zIndex: theme => theme.zIndex.mobileStepper - 1
                }}
            >
                <CircularProgress color='inherit' />
            </Backdrop>
            <DialogConfirmation
                confirmAdd={confirmAdd}
                setConfirmAdd={setConfirmAdd}
                handleAccountSubmit={handleAccountSubmit}
                onSubmit={onSubmit}
                storeAnnouncements={storeAnnouncements}
            />
        </Card>
    )
}

export default AddActions