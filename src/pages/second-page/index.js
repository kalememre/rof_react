// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { useContext } from 'react'

const SecondPage = () => {
  const ability = useContext(AbilityContext)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Create Awesome 🙌'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>This is your second page.</Typography>
            {ability?.can(true, 'can_rosterable') &&
              <Typography sx={{ mb: 2 }}>Emre Kalemmm.</Typography>}
            <Typography>
              Chocolate sesame snaps pie carrot cake pastry pie lollipop muffin.
              Carrot cake dragée chupa chups jujubes. Macaroon liquorice cookie
              wafer tart marzipan bonbon. Gingerbread jelly-o dragée chocolate.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

SecondPage.acl = {
  action: true,
  subject: 'can_approve_leaves'
}

export default SecondPage
