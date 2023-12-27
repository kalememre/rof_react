// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import TableCell from '@mui/material/TableCell'

// ** Configs
import { formatDateTime } from 'src/@core/utils/format'
import { Backdrop, CircularProgress } from '@mui/material'

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  '&:not(:last-child)': {
    paddingRight: `${theme.spacing(2)} !important`
  }
}))

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const PreviewCard = (params) => {
  const { storeAnnouncements } = params
  const announcement = storeAnnouncements.announcement

  // ** Hook
  const theme = useTheme()
  if (announcement) {
    return (
      <Card sx={{ position: 'relative' }}>
        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
          <Grid container>
            <Grid item sm={6} xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h4'>{announcement.title}</Typography>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-end'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Typography sx={{ color: 'text.secondary' }}>Date:</Typography>
                <Typography sx={{ ml: 1, color: 'text.secondary' }}>{formatDateTime(announcement.createdDate)}</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
          <Grid container>
            <Grid item xs={12} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
              <div dangerouslySetInnerHTML={{ __html: announcement.description }}></div>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <CardContent sx={{ px: [6, 10] }}>
          <Typography sx={{ color: 'text.secondary' }}>
            <Typography component='span' sx={{ mr: 1.5, fontWeight: 500, color: 'inherit' }}>
              Created By:
            </Typography>
            {announcement.createdBy}
          </Typography>
        </CardContent>
        <Backdrop
          open={storeAnnouncements.announcementLoading}
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
  } else {
    return null
  }
}

export default PreviewCard
