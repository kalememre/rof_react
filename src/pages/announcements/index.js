import { Box, Button, Card, CardContent, CardHeader, Checkbox, Chip, Divider, FormControlLabel, Grid, MenuItem, Stack, Typography } from '@mui/material'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAnnouncements, getAnnouncementsForUser } from 'src/store/apps/announcements'

// ** Next Imports
import Link from 'next/link'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import PageHeader from 'src/@core/components/page-header'
import CustomTextField from 'src/@core/components/mui/text-field'
import IconifyIcon from 'src/@core/components/icon'
import { getPositions } from 'src/store/apps/position'
import { formatDateTime } from 'src/@core/utils/format'

// ** Custom Component Import
import CustomChip from 'src/@core/components/mui/chip'
import { getBranches } from 'src/store/apps/branch'
import { AbilityContext } from 'src/layouts/components/acl/Can'

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

const Announcements = () => {
    const ability = useContext(AbilityContext)
    const CAN_ADD_ANNOUNCEMENT = ability.can(true, 'CAN_ADD_ANNOUNCEMENT')

    // ** State
    const [filteredData, setFilteredData] = useState(null)
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

    // ** State
    const [branch, setBranch] = useState([])
    const [position, setPosition] = useState([])

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getAnnouncements())
        dispatch(getPositions())
        dispatch(getBranches())
    }, [dispatch])

    const storeAnnouncements = useSelector(state => state.storeAnnouncements)
    const storePositions = useSelector(state => state.storePositions)
    const storeBranches = useSelector(state => state.storeBranches)

    const columns = [
        {
            flex: 0.15,
            minWidth: 180,
            field: 'title',
            headerName: 'Title',
            renderCell: ({ row }) => {
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                            <Typography
                                noWrap
                                component={Link}
                                href={`/announcements/${row.id}`}
                                sx={{
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                    color: 'text.secondary',
                                    '&:hover': { color: 'primary.main' },
                                    whiteSpace: 'pre-line'
                                }}
                            >
                                {row.title}
                            </Typography>
                            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                                {formatDateTime(row.createdDate)}
                            </Typography>
                        </Box>
                    </Box>
                )
            }
        },
        {
            flex: 0.20,
            field: 'positions',
            minWidth: 170,
            headerName: 'Positions',
            renderCell: ({ row }) => {
                const allPositions = storePositions.positions.every((position) =>
                    row.positions.some((pos) => pos.id === position.id)
                );

                return (
                    allPositions ? (
                        <Chip
                            label='All Positions'
                            color='secondary'
                            variant='outlined'
                            sx={{
                                mr: 1,
                            }}
                        />
                    ) : (
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                whiteSpace: 'nowrap',
                                mt: 2,
                                mb: 2,
                                width: '100%',
                            }}
                        >
                            {row?.positions?.map((position, index) => (
                                <Box key={index} mr={1} mb={1} sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}>
                                    {!position.isDeleted ? (
                                        <Box sx={{
                                            borderRadius: 1,
                                            bgcolor: position.color,
                                            color: 'white',
                                            p: 1,
                                        }}>
                                            <Typography variant='subtitle'>
                                                {position.name}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Chip
                                            className='deletedPosition'
                                            label={position.name}
                                        />
                                    )}
                                </Box>
                            ))}
                        </Box>
                    )
                )
            },
        },
        {
            flex: 0.20,
            field: 'branches',
            minWidth: 170,
            headerName: 'Branches',
            renderCell: ({ row }) => {
                // check if all branches included by id
                const allBranches = storeBranches.branches.every((branch) =>
                    row.branches.some((br) => br.id === branch.id)
                );

                return (
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            whiteSpace: 'nowrap',
                            mt: 2,
                            mb: 2,
                            width: '100%',
                        }}
                    >
                        {allBranches ? (
                            <Chip
                                label='All Branches'
                                sx={{
                                    mr: 1,
                                    borderWidth: 1,
                                    borderStyle: 'solid',
                                }}
                            />
                        ) : (
                            row.branches?.map((branch, index) => (
                                <Chip
                                    className={!branch.isDeleted ? 'chipBranch' : 'deletedBranch'}
                                    key={index}
                                    label={branch.name}
                                />
                            ))
                        )}
                    </Box>

                )
            }
        },
    ]

    const [includePositions, setIncludePositions] = useState(true);
    const [includeBranches, setIncludeBranches] = useState(true);

    const handleApplyFilter = useCallback(() => {
        // Filter announcements based on selected positions and branches
        const filteredAnnouncements = storeAnnouncements.announcements.filter((announcement) => {
            const selectedPositions = position.map((pos) => pos.id);
            const selectedBranches = branch.map((br) => br.id);

            // Check if the announcement's positions and branches match the selected ones
            const matchesPositions = includePositions
                ? selectedPositions.every((posId) => announcement.positions.some((pos) => pos.id === posId))
                : selectedPositions.length === announcement.positions.length &&
                selectedPositions.every((posId) => announcement.positions.some((pos) => pos.id === posId));

            const matchesBranches = includeBranches
                ? selectedBranches.every((brId) => announcement.branches.some((br) => br.id === brId))
                : selectedBranches.length === announcement.branches.length &&
                selectedBranches.every((brId) => announcement.branches.some((br) => br.id === brId));

            return matchesPositions && matchesBranches;
        });

        // Set the filtered data and reset pagination
        setFilteredData(filteredAnnouncements);
        setPaginationModel({ page: 0, pageSize: 10 });
    }, [position, branch, includePositions, includeBranches, storeAnnouncements.announcements]);

    // const handleApplyFilter = useCallback(() => {
    //     // Filter announcements based on selected positions and branches
    //     const filteredAnnouncements = storeAnnouncements.announcements.filter((announcement) => {
    //         const selectedPositions = position.map((pos) => pos.id);
    //         const selectedBranches = branch.map((br) => br.id);

    //         // Check if the announcement's positions and branches match the selected ones
    //         const matchesPositions = selectedPositions.every((posId) =>
    //             announcement.positions.some((pos) => pos.id === posId)
    //         );

    //         const matchesBranches = selectedBranches.every((brId) =>
    //             announcement.branches.some((br) => br.id === brId)
    //         );

    //         return matchesPositions && matchesBranches;
    //     });

    //     // Set the filtered data and reset pagination
    //     setFilteredData(filteredAnnouncements);
    //     setPaginationModel({ page: 0, pageSize: 10 });
    // }, [position, branch, storeAnnouncements.announcements]);

    return (
        <Grid container spacing={6.5}>
            <Grid item xs={6}>
                <PageHeader
                    title={
                        <Typography variant='h4'>
                            Announcements List
                        </Typography>
                    }
                    subtitle={
                        <Typography sx={{ color: 'text.secondary' }}>
                            You can view all announcements here.
                        </Typography>
                    }
                />
            </Grid>
            {CAN_ADD_ANNOUNCEMENT && (
                <Grid item xs={6} sx={{
                    alignSelf: 'center',
                    textAlign: 'right'
                }}>
                    <Link href='/announcements/add'>
                        <Button variant="contained">
                            Create Announcement
                        </Button>
                    </Link>
                </Grid>
            )}
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Search Filters' />
                    <CardContent>
                        <Grid container spacing={6}>
                            <Grid item sm={4} xs={12} alignSelf={'center'}>
                                <CustomTextField
                                    select
                                    fullWidth
                                    label='Position'
                                    id='select-position-chip'
                                    sx={{ mb: 2 }}
                                    SelectProps={{
                                        MenuProps,
                                        multiple: true,
                                        value: position,
                                        onChange: e => {
                                            setPosition(e.target.value)
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
                                <FormControlLabel
                                    label='Include All Positions'
                                    sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
                                    control={
                                        <Checkbox
                                            color='primary'
                                            checked={includePositions}
                                            onChange={() => setIncludePositions(!includePositions)}
                                        />
                                    }
                                />
                            </Grid>
                            <Grid item sm={4} xs={12} alignSelf={'center'}>
                                <CustomTextField
                                    select
                                    fullWidth

                                    label='Branch'
                                    id='select-branch-chip'
                                    sx={{ mb: 2 }}
                                    SelectProps={{
                                        MenuProps,
                                        multiple: true,
                                        value: branch,
                                        onChange: e => {
                                            setBranch(e.target.value)
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
                                <FormControlLabel
                                    label='Include All Branches'
                                    sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
                                    control={
                                        <Checkbox
                                            color='primary'
                                            checked={includeBranches}
                                            onChange={() => setIncludeBranches(!includeBranches)}
                                        />
                                    }
                                />
                            </Grid>
                            <Grid item sm={4} xs={12} alignSelf={'center'}>
                                <Button
                                    onClick={handleApplyFilter}
                                    fullWidth
                                    startIcon={<IconifyIcon icon='tabler:filter' />}
                                    variant="outlined"
                                    color="primary"
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        mb: '30px'

                                    }}
                                >
                                    Apply Filter
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Divider sx={{ m: '0 !important' }} />
                    {/* <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} /> */}
                    <DataGrid
                        autoHeight
                        getRowHeight={() => 'auto'}
                        rows={filteredData ?? storeAnnouncements.announcements}
                        columns={columns}
                        disableRowSelectionOnClick
                        pageSizeOptions={[10, 25, 50]}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        loading={storeAnnouncements.announcementLoading}

                        // customization
                        slots={{ toolbar: GridToolbar }}
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        slotProps={{
                            baseButton: {
                                size: 'medium',
                                variant: 'outlined'
                            },
                            toolbar: {
                                // csvOptions: { disableToolbarButton: true },
                                printOptions: { disableToolbarButton: true },
                                showQuickFilter: true,
                                quickFilterProps: {
                                    placeholder: 'Search',
                                    size: 'small',
                                    variant: 'outlined',
                                    color: 'primary',
                                },
                                sx: {
                                    padding: '10px'
                                }
                            }
                        }}
                    />
                </Card>
            </Grid>
        </Grid>
    )
}

export default Announcements