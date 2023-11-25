// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'


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
    flex: 0.2,
    minWidth: 110,
    field: 'email',
    headerName: 'Email',
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.branch_detail.email}
      </Typography>
    )
  },
  {
    flex: 0.125,
    field: 'phone',
    minWidth: 80,
    headerName: 'Phone',
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.branch_detail.phone}
      </Typography>
    )
  },
]

const TableColumns = params => {
  const { storeBranches } = params

  // ** States
  const data = storeBranches.branches
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })


  return (
    <Card>
      {/* <CardHeader title='Quick Filter' /> */}
      <DataGrid
        autoHeight
        columns={columns}
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}

        slots={{ toolbar: GridToolbar }}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        onPaginationModelChange={setPaginationModel}
        rows={data}
        rowSelection={false}
        loading={storeBranches.branchLoading}
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
