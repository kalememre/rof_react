// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Demo Components Imports
import Table from 'src/views/apps/positions/Table'
import PositionCards from 'src/views/apps/positions/PositionCards'

const RolesComponent = () => {
  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Typography variant='h4'>
            Roles List
          </Typography>
        }
        subtitle={
          <Typography sx={{ color: 'text.secondary' }}>
            You can view and manage roles here.
          </Typography>
        }
      />
      <Grid item xs={12}>
        <PositionCards />
      </Grid>
      <Grid item xs={12}>
        {/* <Table /> */}
      </Grid>
    </Grid>
  )
}
RolesComponent.acl = {
  action: 'all',
  subject: 'manager'
}

export default RolesComponent
