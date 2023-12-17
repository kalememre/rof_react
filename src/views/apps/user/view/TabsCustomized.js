// ** React Imports
import { useState } from 'react'

// ** MUI Imports
// import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiTabList from '@mui/lab/TabList'
import MuiTab from '@mui/material/Tab'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import UserViewNotification from './UserViewNotification'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import UserDetail from './UserDetail'
import UserProfile from './UserProfile'
import { Grid } from '@mui/material'
import UserBranches from './UserBranches'

// ** Styled Tab component
const Tab = styled(MuiTab)(({ theme }) => ({
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1.5)
  }
}))

const TabList = styled(MuiTabList)(({ theme }) => ({
  borderBottom: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -1)} !important`
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))

const TabsCustomized = (props) => {
  const { storeUsers } = props
  const user = storeUsers?.user

  // ** State
  const [value, setValue] = useState('1')
  const storePermissions = useSelector(state => state.storePermissions)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
      >
        <Tab value='1' label='Details' icon={<Icon fontSize='1.125rem' icon='tabler:user-check' />} />
        <Tab value='2' label='Permissions' icon={<Icon fontSize='1.125rem' icon='tabler:fingerprint' />} disabled={!user?.isActive} />
        <Tab value='3' label='Holidays' icon={<Icon fontSize='1.125rem' icon='tabler:beach' />} disabled={!user?.isActive} />
      </TabList>
      <TabPanel sx={{ p: 0 }} value='1'>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <UserDetail storeUsers={storeUsers} />
          </Grid>
          <Grid item xs={12}>
            <UserProfile storeUsers={storeUsers} />
          </Grid>
          <Grid item xs={12}>
            <UserBranches storeUsers={storeUsers} />
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel sx={{ p: 0 }} value='2'>
        <UserViewNotification storeUsers={storeUsers} />
      </TabPanel>
      <TabPanel value='3'>
        <Typography>
          Danish tiramisu jujubes cupcake chocolate bar cake cheesecake chupa chups. Macaroon ice cream tootsie roll
          carrot cake gummi bears.
        </Typography>
      </TabPanel>
    </TabContext>
  )
}

export default TabsCustomized
