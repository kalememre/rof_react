// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'

import { ThemeProvider, createTheme } from '@mui/material/styles';

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import { Stack } from '@mui/material'

const data = [
  {
    progress: 54,
    title: 'Laravel',
    subtitle: 'eCommerce',
    progressColor: 'error',
    imgSrc: '/images/logos/laravel.png'
  },
  {
    progress: 85,
    title: 'Figma',
    subtitle: 'App UI Kit',
    progressColor: 'primary',
    imgSrc: '/images/logos/figma.png'
  },
  {
    progress: 64,
    title: 'VusJs',
    subtitle: 'Calendar App',
    progressColor: 'success',
    imgSrc: '/images/logos/vuejs.png'
  },
  {
    progress: 40,
    title: 'React',
    subtitle: 'Dashboard',
    progressColor: 'info',
    imgSrc: '/images/logos/react.png'
  },
  {
    progress: 17,
    title: 'Bootstrap',
    subtitle: 'Website',
    progressColor: 'primary',
    imgSrc: '/images/logos/bootstrap.png'
  },
  {
    progress: 30,
    title: 'Sketch',
    progressColor: 'warning',
    subtitle: 'Website Design',
    imgSrc: '/images/logos/sketch.png'
  }
]

const CardActiveProjects = props => {
  const { calculateTotalHoursByUser } = props
  const listStaff = calculateTotalHoursByUser();

  const colorsArr = listStaff?.map((role) => {
    return (
      {
        [role.position]: {
          main: role?.color === 'lightgray' ? '#D3D3D3' : role.color || '#D3D3D3',
        }
      }
    )
  })

  const theme = createTheme({
    palette: {
      ...colorsArr.reduce((acc, color) => ({ ...acc, ...color }), {})
    },
  });

  return (
    <Card>
      <CardHeader
        title='Staff Hours'

      // subheader='Average 72% completed'
      />
      <CardContent>
        {listStaff.sort((a, b) => a.sort - b.sort).map((item, index) => {
          return (
            <ThemeProvider key={index} theme={theme}>
              <Stack sx={{ p: 0, height: '100%', width: '100%' }} direction='column' spacing={2}>

                <Stack direction={'row'}>

                  <Box
                    key={index}
                    sx={{
                      width: '100%',
                      flexDirection: 'column',
                      display: 'flex',
                      alignItems: 'flex-start',
                      height: '100%',

                      // maxHeight: '20px',

                      mb: index !== listStaff.length - 1 ? 2.5 : undefined
                    }}
                  >
                    <Box
                      sx={{
                        rowGap: 10,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='body2'>{item.title}</Typography>
                        <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                          {item.position}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <LinearProgress
                            value={item.totalHours}
                            variant='buffer'

                            color={item.position}
                            sx={{ height: 5, width: '100%' }}
                          />
                          {/* <Typography sx={{ color: 'text.disabled' }}>{`${item.progress}%`}</Typography> */}
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'right' }}>
                        <Typography sx={{ color: 'text.disabled' }}>{`${item.totalHours}`}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Stack>
              </Stack>

            </ThemeProvider>

          )
        })}
      </CardContent>
    </Card>
  )
}

export default CardActiveProjects
