// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { Backdrop, Box, CircularProgress, FormHelperText } from '@mui/material'

const CardStatisticsExpenses = props => {
  const percentage = props.limitWorkHours !== 0 ? (props.totalHours / props.limitWorkHours * 100) : 0;
  const { storeBranches } = props

  // ** Hook
  const theme = useTheme()

  const options = {
    chart: {
      sparkline: { enabled: true }
    },
    stroke: { lineCap: 'round' },
    colors: [hexToRGBA(theme.palette.primary.main, 1)],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    plotOptions: {
      radialBar: {
        endAngle: 90,
        startAngle: -90,
        hollow: { size: '64%' },
        track: {
          strokeWidth: '40%',
          background: hexToRGBA(theme.palette.customColors.trackBg, 1)
        },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: -3,
            fontWeight: 600,
            color: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.h4.fontSize
          }
        }
      }
    },
    grid: {
      padding: {
        bottom: 15
      }
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        options: {
          chart: { height: 200 }
        }
      },
      {
        breakpoint: 960,
        options: {
          chart: { height: 160 }
        }
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          chart: { height: 190 }
        }
      },
      {
        breakpoint: 660,
        options: {
          chart: { height: 160 }
        }
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          chart: { height: 150 }
        }
      },
      {
        breakpoint: 425,
        options: {
          chart: { height: 130 }
        }
      }
    ]
  }

  return (
    <Card sx={{ position: 'relative', overflow: 'hidden', mb: 2 }}>
      <CardContent>
        <Typography variant='h5'>{props.totalHours} / {props.limitWorkHours || 'No Limit'}</Typography>
        <Typography variant='body2' sx={{ color: 'text.disabled' }}>
          Weekly Hours
        </Typography>
        <ReactApexcharts type='radialBar' height={160} series={[percentage.toFixed(2)]} options={options} />
        <Typography variant='body2' sx={{ textAlign: 'center', color: 'text.disabled' }}>
          Max working hours for this branch weekly
        </Typography>
      </CardContent>
      <Backdrop
        open={storeBranches.branchLoading}
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

export default CardStatisticsExpenses
