// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'
import { ThemeProvider, createTheme } from '@mui/material/styles';

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Icons Imports
import Icon from 'src/@core/components/icon'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import RoleListAccordion from './RoleListAccordion'
import CardActionsRefresh from './CardActionsRefresh'
import { toggleColor } from 'src/store/apps/holidays'

const SidebarLeft = props => {
  const {
    storeHolidays,
    mdAbove,
    dispatch,
    branches,
    selectBranch,
    isLoading,
    roles,
    leftSidebarOpen,
    leftSidebarWidth,
    handleSelectEvent,
    handleLeftSidebarToggle,
    handleAddEventSidebarToggle
  } = props

  const colorsArr = roles.map((role) => {
    return (
      {
        [role.name]: {
          main: role.color,
        }
      }
    )
  })

  const theme = createTheme({
    palette: {
      ...colorsArr.reduce((acc, color) => ({ ...acc, ...color }), {})
    },
  });


  const renderFilters = roles.length
    ? roles?.map((role, index) => {
      return (
        <ThemeProvider key={index} theme={theme}>
          <FormControlLabel
            label={role.name}
            sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
            control={
              <Checkbox
                color={role.name}
                sx={{ color: role.color }}
                checked={storeHolidays.selectedColors.includes(role.color)}
                onChange={() => dispatch(toggleColor(role.color))}
              />
            }
          />
        </ThemeProvider>
      )
    })
    : null

  const handleSidebarToggleSidebar = () => {
    handleAddEventSidebarToggle()
    dispatch(handleSelectEvent(null))
  }
  console.log('leftSidebarOpen', leftSidebarOpen);
  if (renderFilters) {
    return (
      <Box

        // open={leftSidebarOpen}
        // onClose={handleLeftSidebarToggle}
        // variant={mdAbove ? 'permanent' : 'temporary'}
        // ModalProps={{
        //   disablePortal: true,
        //   disableAutoFocus: true,
        //   disableScrollLock: true,
        //   keepMounted: true // Better open performance on mobile.
        // }}

        bgcolor={'white'}
        sx={{
          borderRight: '1px solid #e0e0e0',
          display: 'block',
          position: 'static',
          '& .MuiDrawer-paper': {
            borderRadius: 1,
            boxShadow: 'none',
            width: leftSidebarWidth,
            borderTopRightRadius: 0,
            alignItems: 'flex-start',
            borderBottomRightRadius: 0,
            position: 'static'
          },
          '& .MuiBackdrop-root': {
            borderRadius: 1,
            position: 'absolute'
          }
        }}
      >
        {/* <Box sx={{ p: 6, width: '100%' }}>
          <Button fullWidth variant='contained' sx={{ '& svg': { mr: 2 } }} onClick={() => handleLeftSidebarToggle(false)}>
            <Icon icon='tabler:cancel' fontSize='1.125rem' />
            Close Drawer
          </Button>
        </Box> */}

        <Divider sx={{ width: '100%', m: '0 !important' }} />
        <CardActionsRefresh
          branches={branches}
          isLoading={isLoading}
          storeHolidays={storeHolidays}
          selectBranch={selectBranch}
        />
        <Divider sx={{ width: '100%', m: '0 !important' }} />
        <Box sx={{ p: 6, width: '100%', display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
          <Typography variant='body2' sx={{ mb: 2, color: 'text.disabled', textTransform: 'uppercase' }}>
            Filters
          </Typography>
          <FormControlLabel
            label='Pending'
            sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
            control={
              <Checkbox
                color='secondary'
                checked={storeHolidays.selectedColors.includes('lightgray')}
                onChange={() => dispatch(toggleColor('lightgray'))}
              />
            }
          />
          {renderFilters}
        </Box>
      </Box>
    )
  } else {
    return null
  }
}

export default SidebarLeft
