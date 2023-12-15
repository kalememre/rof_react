// ** MUI Imports
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import TableContainer from '@mui/material/TableContainer'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPermissions, getUserPermissions, updateUserPermissions } from 'src/store/apps/permissions'
import { Backdrop, CircularProgress, FormControlLabel, FormHelperText } from '@mui/material'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'

const UserViewNotification = () => {
  // ** Router & Params
  const router = useRouter()
  const { id } = router.query

  // ** State
  const [selectedCheckbox, setSelectedCheckbox] = useState([])
  const dispatch = useDispatch()
  const storePermissions = useSelector(state => state.storePermissions)
  useEffect(() => {
    dispatch(getUserPermissions(id))
    dispatch(getPermissions())
  }, [dispatch, id])

  useEffect(() => {
    // set selected checkbox with user permissions
    const arr = []
    storePermissions?.userPermissions?.forEach(permission => {
      arr.push(permission.id)
    })
    setSelectedCheckbox([...arr])
  }, [storePermissions?.userPermissions])

  // ** Function to toggle permission
  const togglePermission = id => {
    const arr = selectedCheckbox
    if (selectedCheckbox.includes(id)) {
      arr.splice(arr.indexOf(id), 1)
      setSelectedCheckbox([...arr])
    } else {
      arr.push(id)
      setSelectedCheckbox([...arr])
    }
  }

  const handleSave = () => {
    dispatch(updateUserPermissions({ userId: id, permissions: selectedCheckbox }))
  }

  return (
    <Box sx={{ position: 'relative' }}>

      <Card>
        <CardHeader title='Permissions' sx={{ pb: 1.5 }} />

        <CardContent>
          <Typography sx={{ mb: 6, color: 'text.secondary' }}>
            You can set the permissions for each user by checking the box beside the permission.
          </Typography>
          <TableContainer sx={{ borderRadius: '6px !important', border: theme => `1px solid ${theme.palette.divider}` }}>
            <Table sx={{ minWidth: 500 }}>
              <TableBody sx={{ '& .MuiTableRow-root:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                {
                  storePermissions?.permissions?.map((permission, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <FormControlLabel
                          label={
                            <div>
                              <Typography variant='body' sx={{ fontWeight: 600, color: 'text.primary' }}>
                                {permission.roleLabel}
                              </Typography>
                              <FormHelperText>{permission.description}</FormHelperText>
                            </div>
                          }
                          sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                          control={
                            <Checkbox
                              size='small'
                              id={permission.id}
                              onChange={() => togglePermission(permission.id)}
                              checked={selectedCheckbox.includes(permission.id)}
                            />
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))
                }

              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>

        <CardActions sx={{
          justifyContent: 'flex-end',
        }}>
          <Button
            onClick={handleSave}
            variant='contained' color='primary'>
            Save Changes
          </Button>
        </CardActions>

        <Backdrop
          open={storePermissions?.permissionLoading || false}
          sx={{
            position: 'absolute',
            color: 'common.white',
            zIndex: theme => theme.zIndex.mobileStepper - 1,
            borderRadius: '6px !important',
          }}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      </Card>
    </Box>
  )
}

export default UserViewNotification
