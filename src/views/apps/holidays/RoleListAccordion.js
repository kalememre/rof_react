// ** MUI Imports
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'

const StyledList = styled(List)(({ theme }) => ({
  '& .MuiListItem-container': {
    border: `1px solid ${theme.palette.divider}`,
    '&:first-of-type': {
      borderTopLeftRadius: theme.shape.borderRadius,
      borderTopRightRadius: theme.shape.borderRadius
    },
    '&:last-child': {
      borderBottomLeftRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius
    },
    '&:not(:last-child)': {
      borderBottom: 0
    },
    '& .MuiListItem-root': {
      paddingRight: theme.spacing(24)
    },
    '& .MuiListItemText-root': {
      marginTop: 0,
      '& .MuiTypography-root': {
        fontWeight: 500
      }
    }
  }
}))

const RoleListAccordion = props => {
  // ** Props
  const { roles } = props

  return (
    <StyledList disablePadding>
      <ListItem>
        <ListItemAvatar >
          <Icon icon='mdi:circle' fontSize='1.125rem' color='lightgray' />
        </ListItemAvatar>
        <div>
          <ListItemText primary='Pending' />
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant='caption' sx={{ color: 'text.disabled' }}>
              Ready to be approved
            </Typography>
          </Box>
        </div>
      </ListItem>
      {
        roles?.map((role, index) => {
          return (

            <ListItem key={index}>
              <ListItemAvatar >
                <Icon icon='mdi:circle' fontSize='1.125rem' color={role.color} />
              </ListItemAvatar>
              <div>
                <ListItemText primary={role.name} />
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                    Total {role.users_quantity} users
                  </Typography>
                </Box>
              </div>
            </ListItem>
          )
        })
      }
    </StyledList>
  )
}

export default RoleListAccordion
