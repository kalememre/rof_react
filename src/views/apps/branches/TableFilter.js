// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import CreateBranch from './CreateBranch'
import { IconButton } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import DialogConfirmation from './DialogConfirmation'
import { Stack } from '@mui/system'





const TableColumns = params => {
  const { storeBranches } = params

  // ** States
  const data = storeBranches.branches
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [row, setRow] = useState({})
  const [title, setTitle] = useState('Edit')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const editBranch = e => {
    toggleAddBranchDrawer()
    setRow(e.row)
  }

  const [addBranchOpen, setAddBranchOpen] = useState(false)

  const toggleAddBranchDrawer = () => setAddBranchOpen(!addBranchOpen)

  const columns = [
    {
      flex: 0.275,
      minWidth: 290,
      field: 'name',
      headerName: 'Name',
      renderCell: params => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.name}
              </Typography>
            </Box>
          </Box>
        )
      }
    },

    {
      flex: 0.125,
      field: 'phone',
      minWidth: 80,
      headerName: 'Phone',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.phone}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'email',
      headerName: 'Email',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.email}
        </Typography>
      )
    },
    {
      flex: 0.1,
      field: 'delete',
      minWidth: 10,
      headerName: 'Action',
      headerAlign: 'center',
      renderCell: params => (
        <Stack direction='row' spacing={0} justifyContent={'center'} width={'100%'}>
          <IconButton color='info' onClick={() => {
            editBranch(params)
          }}>
            <Icon icon='tabler:edit' />
          </IconButton>
          <IconButton color='error' onClick={() => {
            setConfirmDelete(true)
            setRow(params.row)
          }}>
            <Icon icon='tabler:trash' />
          </IconButton>
        </Stack>
      )
    },
  ]

  return (
    <Card>
      <CreateBranch
        row={row}
        open={addBranchOpen}
        toggle={toggleAddBranchDrawer}
        title={title}
      />
      <DialogConfirmation
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        branchId={row.id}
        storeBranches={storeBranches}
      />
      <DataGrid
        autoHeight
        columns={columns}
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}

        slots={{ toolbar: GridToolbar }}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        onPaginationModelChange={setPaginationModel}
        rows={data}
        rowSelection={false}
        loading={storeBranches.branchLoading}
        key={data.id}
        style={{
          toolbar: {
            backgroundColor: 'red'
          }
        }}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: '1.125rem'
          }
        }}
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
              placeholder: 'Search Branches',
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
  )
}

export default TableColumns
