import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, MenuItem, Stack, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
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



const Announcements = () => {
    // ** State
    const [filteredData, setFilteredData] = useState(null)
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
    const [position, setPosition] = useState('')

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getAnnouncements())
        dispatch(getPositions())
    }, [dispatch])

    const storeAnnouncements = useSelector(state => state.storeAnnouncements)
    const storePositions = useSelector(state => state.storePositions)

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
                                    '&:hover': { color: 'primary.main' }
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
            renderCell: ({ row }) => (
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap', // Flex içinde sığmayan öğelerin alt satıra kaymasını sağlar
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
                            <Box sx={{
                                borderRadius: 1,
                                bgcolor: position.color,
                                p: 1,
                            }}>
                                <Typography variant='subtitle' color={'white'}>
                                    {position.name}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            ),
        },
        {
            flex: 0.10,
            field: 'branches',
            minWidth: 170,
            headerName: 'Branches',
            renderCell: ({ row }) => {
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography color={'black'}>
                            {row.branches.join(', ')}
                        </Typography>
                    </Box>
                )
            }
        },
    ]

    const handleApplyFilter = useCallback(() => {
        // const filteredRows = storeUsers.users.filter(row => {
        //     if (role && row?.userProfile?.position.id !== role) return false
        //     if (status && row.isActive !== status) return false

        //     return true
        // })
        // setFilteredData(filteredRows)

    }, [])

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
            <Grid item xs={6} sx={{
                alignSelf: 'center',
                textAlign: 'right'
            }}>
                {/* <Button onClick={toggleAddUserDrawer} variant="contained">
                        Create User
                    </Button> */}
                <Link href='/announcements/add'>
                    <Button variant="contained">
                        Create Announcement
                    </Button>
                </Link>
            </Grid>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Search Filters' />
                    <CardContent>
                        <Grid container spacing={6}>
                            <Grid item sm={4} xs={12}>
                                <CustomTextField
                                    select
                                    fullWidth
                                    defaultValue='All'
                                    label='Role'
                                    disabled={storePositions.loading}
                                    SelectProps={{
                                        value: position,
                                        displayEmpty: true,
                                        onChange: e => handleRoleChange(e)
                                    }}
                                >
                                    <MenuItem selected value=''><em>All</em></MenuItem>
                                    {storePositions.positions?.map((role, index) => (
                                        <MenuItem key={index} value={role.id}>
                                            {role.name}
                                        </MenuItem>
                                    ))}
                                </CustomTextField>
                            </Grid>
                            <Grid item sm={4} xs={12}>
                                <CustomTextField
                                    select
                                    fullWidth
                                    defaultValue='Select Status'
                                    label='Status'
                                    SelectProps={{
                                        value: status,
                                        displayEmpty: true,
                                        onChange: e => handleStatusChange(e)
                                    }}
                                >
                                    <MenuItem selected value=''><em>All</em></MenuItem>
                                    <MenuItem value='Active'>Active</MenuItem>
                                    <MenuItem value='Inactive'>Inactive</MenuItem>
                                </CustomTextField>
                            </Grid>
                            <Grid item sm={4} xs={12} alignSelf={'flex-end'}>
                                <Button
                                    onClick={handleApplyFilter}
                                    fullWidth
                                    startIcon={<IconifyIcon icon='tabler:filter' />}
                                    variant="outlined"
                                    color="primary"
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
                                csvOptions: { disableToolbarButton: true },
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