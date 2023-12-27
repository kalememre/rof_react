// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Backdrop, Box, Chip, CircularProgress, Divider, Grid, Typography } from '@mui/material'

const PreviewActions = (params) => {
  const { storeAnnouncements, storePositions, storeBranches } = params
  const announcement = storeAnnouncements.announcement

  const PositionsSection = () => {
    const allPositions = storePositions.positions?.every((position) =>
      announcement.positions?.some((pos) => pos.id === position.id)
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
          {announcement.positions?.map((position, index) => (
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
  }

  const BranchesSection = () => {
    const allBranches = storeBranches.branches?.every((branch) =>
      announcement.branches?.some((br) => br.id === branch.id)
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
          announcement.branches?.map((branch, index) => (
            !branch.isDeleted ? (
              <Chip
                className='chipBranch'
                key={index}
                label={branch.name}
              />
            ) : (
              <Chip
                className='deletedBranch'
                key={index}
                label={branch.name}
              />
            )
          ))
        )}
      </Box>

    )
  }


  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h4' sx={{ mb: 2 }}>
              Positions
            </Typography>
            <Divider />
            <PositionsSection />
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h4' sx={{ mb: 2 }}>
              Branches
            </Typography>
            <Divider />
            <BranchesSection />
          </Grid>
        </Grid>
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
}

export default PreviewActions
