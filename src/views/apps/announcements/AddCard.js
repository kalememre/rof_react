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
import EditorControlled from './EditorControlled'

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

const AddCard = props => {
    const {
        accountErrors,
        accountControl,
        setAccountError,
        setValueAccount,
    } = props

    return (
        <EditorControlled
            accountErrors={accountErrors}
            accountControl={accountControl}
            setAccountError={setAccountError}
            setValueAccount={setValueAccount}
        />
    )
}

export default AddCard