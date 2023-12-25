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
import { Stack } from '@mui/system'

const SidebarLeft = props => {
  const {
    storeHolidays,
    dispatch,
    storeBranches,
    selectBranch,
    storePositions,
    leftSidebarWidth,
    mdAbove,
    can_see_branch_holidays
  } = props

  const colorsArr = storePositions.positions.map((role) => {
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


  const renderFilters = storePositions.positions.length
    ? storePositions.positions?.map((role, index) => {
      return (
        <ThemeProvider key={index} theme={theme}>
          <FormControlLabel
            label={role.name}
            sx={{ '& .MuiFormControlLabel-label': { color: role.color } }}
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

  if (renderFilters) {
    return (
      <Drawer

        open={can_see_branch_holidays}

        // onClose={handleLeftSidebarToggle}
        variant={mdAbove ? 'permanent' : 'temporary'}
        ModalProps={{
          disablePortal: true,
          disableAutoFocus: true,
          disableScrollLock: true,
          keepMounted: true // Better open performance on mobile.
        }}

        bgcolor={'white'}
        sx={{
          // borderRight: '1px solid #e0e0e0',
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
        </Box>

        <Divider sx={{ width: '100%', m: '0 !important' }} /> */}
        <Stack sx={{ p: 0, height: '100%', width: '100%' }} direction='column' spacing={2}>
          <Stack direction={'row'} >
            <CardActionsRefresh
              storeBranches={storeBranches}
              storeHolidays={storeHolidays}
              selectBranch={selectBranch}
            />
          </Stack>
          <Divider sx={{ width: '100%', m: '0 !important' }} />
          <Stack direction={'row'}>
            <Box sx={{
              p: 6,
              width: '100%',
              flexDirection: 'column',
              display: 'flex',
              alignItems: 'flex-start',
              height: '100%',
              maxHeight: '10px',
            }}>
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
          </Stack>

        </Stack>
        {/* <Stack sx={{ p: 6, height: '100%', width: '100%' }} direction='row' spacing={2}>

          <Box sx={{ flexGrow: 0.11 }}>
            <CardActionsRefresh
              storeBranches={storeBranches}
              storeHolidays={storeHolidays}
              selectBranch={selectBranch}
            />
          </Box>
          <Divider sx={{ width: '100%', m: '0 !important' }} />

          <Box sx={{
            flexGrow: 0.8,
            p: 6,
            width: '100%',

            display: 'flex',

            alignItems: 'flex-start',

            flexDirection: 'column',
            height: '100%',

            // maxHeight: '400px',
            // overflowY: 'auto',
            bottom: '0px !important',

            position: 'absolute !important',
          }}>
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
        </Stack> */}

      </Drawer>
    )
  } else {
    return null
  }
}

export default SidebarLeft
