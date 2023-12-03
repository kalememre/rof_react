// ** React Imports
import { useState, useEffect, useCallback, useContext } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid, GridToolbar, GridToolbarQuickFilter } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { getUsers } from 'src/store/apps/user'

// ** Third Party Components
import axios from 'axios'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import { CircleFlag } from 'react-circle-flags'
import { Button } from '@mui/material'
import { getRoles } from 'src/store/apps/role'
import PageHeader from 'src/@core/components/page-header'
import { AbilityContext } from 'src/layouts/components/acl/Can'


const userStatusObj = {
    true: 'success',
    false: 'secondary'
}

const RowOptions = ({ id }) => {
    // ** Hooks
    const dispatch = useDispatch()

    // ** State
    const [anchorEl, setAnchorEl] = useState(null)
    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = event => {
        setAnchorEl(event.currentTarget)
    }

    const handleRowOptionsClose = () => {
        setAnchorEl(null)
    }

    const handleDelete = () => {
        dispatch(deleteUser(id))
        handleRowOptionsClose()
    }

    return (
        <>
            <IconButton size='small' onClick={handleRowOptionsClick}>
                <Icon icon='tabler:dots-vertical' />
            </IconButton>
            <Menu
                keepMounted
                anchorEl={anchorEl}
                open={rowOptionsOpen}
                onClose={handleRowOptionsClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                PaperProps={{ style: { minWidth: '8rem' } }}
            >
                <MenuItem
                    component={Link}
                    sx={{ '& svg': { mr: 2 } }}
                    href='/apps/user/view/account'
                    onClick={handleRowOptionsClose}
                >
                    <Icon icon='tabler:eye' fontSize={20} />
                    View
                </MenuItem>
                <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
                    <Icon icon='tabler:edit' fontSize={20} />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
                    <Icon icon='tabler:trash' fontSize={20} />
                    Delete
                </MenuItem>
            </Menu>
        </>
    )
}

const columns = [
    {
        flex: 0.25,
        minWidth: 280,
        field: 'fullName',
        headerName: 'User',
        renderCell: ({ row }) => {
            const { first_name, last_name, email } = row
            const fullName = `${first_name} ${last_name}`

            return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ mr: 2.5 }}><CircleFlag countryCode={row.user_profile?.country?.toLowerCase()} height="35" /></Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                        <Typography
                            noWrap
                            component={Link}
                            href='/apps/user/view/account'
                            sx={{
                                fontWeight: 500,
                                textDecoration: 'none',
                                color: 'text.secondary',
                                '&:hover': { color: 'primary.main' }
                            }}
                        >
                            {fullName}
                        </Typography>
                        <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                            {email}
                        </Typography>
                    </Box>
                </Box>
            )
        }
    },
    {
        flex: 0.15,
        field: 'role',
        minWidth: 170,
        headerName: 'Role',
        renderCell: ({ row }) => {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* <CustomAvatar
                        skin='light'
                        sx={{ mr: 4, width: 30, height: 30 }}
                        color={userRoleObj[row.role]?.color || 'primary'}
                    >
                        <Icon icon={userRoleObj[row.role]?.icon} />
                    </CustomAvatar> */}
                    <Box sx={{
                        borderRadius: 1,
                        bgcolor: row.user_profile?.role.color,
                        p: 1,
                    }}>
                        <Typography color={'white'}>
                            {row.user_profile?.role.name}
                        </Typography>
                    </Box>
                </Box>
            )
        }
    },
    {
        flex: 0.1,
        minWidth: 110,
        field: 'status',
        headerName: 'Status',
        renderCell: ({ row }) => {
            return (
                <CustomChip
                    rounded
                    skin='light'
                    size='small'
                    label={row.is_active ? 'Active' : 'Inactive'}
                    color={userStatusObj[row.is_active]}
                    sx={{ textTransform: 'capitalize' }}
                />
            )
        }
    },
    {
        flex: 0.1,
        minWidth: 100,
        sortable: false,
        field: 'actions',
        headerName: 'Actions',
        renderCell: ({ row }) => <RowOptions id={row.id} />
    }
]

const UserList = ({ apiData }) => {
    // ** Hooks
    const dispatch = useDispatch()
    const storeUsers = useSelector(state => state.storeUsers)
    const storeRoles = useSelector(state => state.storeRoles)

    // ** State
    const [role, setRole] = useState('')
    const [value, setValue] = useState('')
    const [status, setStatus] = useState('')
    const [addUserOpen, setAddUserOpen] = useState(false)
    const [filteredData, setFilteredData] = useState(null)
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })


    // ** Abilities
    const ability = useContext(AbilityContext)
    const can_create_user = ability?.can(true, 'can_create_user')

    useEffect(() => {
        dispatch(getUsers())
        dispatch(getRoles())
    }, [dispatch])

    const handleFilter = useCallback(val => {
        console.log(val);
        setValue(val)
    }, [])

    const handleApplyFilter = useCallback(() => {
        const filteredRows = storeUsers.users.filter(row => {
            if (role && row.role.id !== role) return false
            if (status && row.status !== status) return false

            return true
        })
        setFilteredData(filteredRows)

    }, [role, status, storeUsers.users])

    const handleRoleChange = useCallback(e => {
        setRole(e.target.value)
    }, [])

    const handleStatusChange = useCallback(e => {
        setStatus(e.target.value)
    }, [])
    const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

    return (
        <Grid container spacing={6.5}>
            <Grid item xs={6}>

                <PageHeader
                    title={
                        <Typography variant='h4'>
                            Users List
                        </Typography>
                    }
                    subtitle={
                        <Typography sx={{ color: 'text.secondary' }}>
                            You can view and manage users here.
                        </Typography>
                    }
                />
            </Grid>
            {can_create_user &&
                <Grid item xs={6} sx={{
                    alignSelf: 'center',
                    textAlign: 'right'
                }}>
                    {/* <Button onClick={toggleAddUserDrawer} variant="contained">
                        Create User
                    </Button> */}
                    <Link href='/users/add'>
                        <Button variant="contained">
                            Create User
                        </Button>
                    </Link>
                </Grid>
            }
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
                                    disabled={storeRoles.loading}
                                    SelectProps={{
                                        value: role,
                                        displayEmpty: true,
                                        onChange: e => handleRoleChange(e)
                                    }}
                                >
                                    <MenuItem selected value=''><em>All</em></MenuItem>
                                    {storeRoles.roles?.map((role, index) => (
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
                                    startIcon={<Icon icon='tabler:filter' />}
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
                        rowHeight={62}
                        rows={filteredData ?? storeUsers.users}
                        columns={columns}
                        disableRowSelectionOnClick
                        pageSizeOptions={[10, 25, 50]}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        loading={storeUsers.userLoading}

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
                                    placeholder: 'Search User',
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

            <AddUserDrawer storeRoles={storeRoles} open={addUserOpen} toggle={toggleAddUserDrawer} />
        </Grid>
    )
}

// export const getStaticProps = async () => {
//     const res = await axios.get('/cards/statistics')
//     const apiData = res.data

//     return {
//         props: {
//             apiData
//         }
//     }
// }

UserList.acl = {
    action: true,
    subject: 'can_see_branch_users'
}

export default UserList
