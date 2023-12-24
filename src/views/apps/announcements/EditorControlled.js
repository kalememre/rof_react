// ** React Imports
import { useEffect, useState } from 'react'

// ** Third Party Imports
import { EditorState, convertToRaw } from 'draft-js'

// ** Custom Component Import
import CustomChip from 'src/@core/components/mui/chip'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import { Box, Button, FormControl, FormControlLabel, FormHelperText, Grid, MenuItem, Radio, RadioGroup, Typography } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { getBranches } from 'src/store/apps/branch'
import { getPositions } from 'src/store/apps/position'
import { useDispatch, useSelector } from 'react-redux'
import { addAnnouncement } from 'src/store/apps/announcements'
import { useRouter } from 'next/router'

const EditorControlled = () => {
  const router = useRouter()

  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8

  const MenuProps = {
    PaperProps: {
      style: {
        width: 250,
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
      }
    }
  }

  // ** State
  const [branch, setBranch] = useState([])
  const [position, setPosition] = useState([])
  const [includeUsersOnVacation, setIncludeUsersOnVacation] = useState(false)
  const [value, setValue] = useState(EditorState.createEmpty())
  const htmlValue = draftToHtml(convertToRaw(value.getCurrentContent()))

  const defaultAccountValues = {
    position: [],
    branch: [],
    title: '',
    description: '',
    includeUsersOnVacation: false
  }

  const accountSchema = yup.object().shape({
    title: yup.string().required('Title field is required'),
    description: yup.string().required('Description field is required'),
    position: yup.array().min(1, 'Position field is required'),
    branch: yup.array().min(1, 'Branch field is required'),
  })

  // ** Hooks
  const {
    reset: accountReset,
    control: accountControl,
    handleSubmit: handleAccountSubmit,
    setValue: setValueAccount,
    trigger: triggerAccount,
    getValues: getAccountValues,
    formState: { errors: accountErrors },
    setError: setAccountError
  } = useForm({
    defaultValues: defaultAccountValues,
    resolver: yupResolver(accountSchema)
  })

  // ** Hooks
  const dispatch = useDispatch()
  const storeBranches = useSelector(state => state.storeBranches)
  const storePositions = useSelector(state => state.storePositions)

  useEffect(() => {
    dispatch(getBranches())
    dispatch(getPositions())
  }, [dispatch])

  const handleChangeRadio = event => {
    setIncludeUsersOnVacation(event.target.value === 'true');
    setValueAccount('includeUsersOnVacation', event.target.value === 'true');
  }

  const onSubmit = data => {
    const finalData = {
      branches: data.branch.map(branch => branch.id),
      positions: data.position.map(position => position.id),
      title: data.title,
      description: data.description,
      includeUsersOnVacation: includeUsersOnVacation
    }
    console.log(finalData);

    const result = dispatch(addAnnouncement(finalData))
    result.then(res => {
      if (!res.error) {
        router.push('/announcements')
      }
    })
  }

  return (
    <Grid container spacing={6} className='match-height'>
      <Grid item xs={12} sm={6}>
        <Controller
          name='title'
          control={accountControl}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <CustomTextField
              fullWidth
              value={value}
              sx={{ mb: 2 }}
              label='Title'
              onChange={onChange}
              placeholder="Enter user's name"
              error={Boolean(accountErrors.title)}
              {...(accountErrors.title && { helperText: accountErrors.title.message })}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography>Include Users On Holiday?</Typography>
        <FormControl sx={{ flexWrap: 'wrap', flexDirection: 'row' }}>
          <RadioGroup
            row
            aria-label='controlled'
            name='includeUsersOnVacation'
            value={includeUsersOnVacation ? 'true' : 'false'} // 'true' veya 'false' olarak ayarlayın
            onChange={handleChangeRadio}
          >
            <FormControlLabel value='true' control={<Radio />} label='Yes' />
            <FormControlLabel value='false' control={<Radio />} label='No' />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <ReactDraftWysiwyg
          editorState={value}
          onEditorStateChange={data => {
            setValue(data)

            // check if editor is empty
            if (!data.getCurrentContent().hasText()) {
              setAccountError('description', {
                type: 'manual',
                message: 'Description field is required222'
              })
            } else {
              setAccountError('description', null)
              setValueAccount('description', htmlValue)
            }

            // triggerAccount('description')
          }}
        />
        <FormHelperText error={Boolean(accountErrors.description)}>
          {accountErrors.description && accountErrors.description.message}
        </FormHelperText>
      </Grid>
      <Grid item sm={6} xs={12}>
        <CustomTextField
          select
          fullWidth
          label='Branch'
          id='select-branch-chip'
          sx={{ mb: 2 }}
          error={Boolean(accountErrors.branch)}
          {...(accountErrors.branch && { helperText: accountErrors.branch.message })}
          SelectProps={{
            MenuProps,
            multiple: true,
            value: branch,
            onChange: e => {
              setBranch(e.target.value)
              setValueAccount('branch', e.target.value)
              triggerAccount('branch')
            },
            renderValue: selected => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {selected.map(value => (
                  <CustomChip key={value.id} label={value.name} sx={{ m: 0.75 }} skin='light' color='primary' />
                ))}
              </Box>
            )
          }}
        >
          {storeBranches.branches.map(branch => (
            <MenuItem key={branch.id} value={branch}>
              {branch.name}
            </MenuItem>
          ))}
        </CustomTextField>
      </Grid>
      <Grid item sm={6} xs={12}>
        <CustomTextField
          select
          fullWidth
          label='Position'
          id='select-position-chip'
          sx={{ mb: 2 }}
          error={Boolean(accountErrors.position)}
          {...(accountErrors.position && { helperText: accountErrors.position.message })}
          SelectProps={{
            MenuProps,
            multiple: true,
            value: position,
            onChange: e => {
              setPosition(e.target.value)
              setValueAccount('position', e.target.value)
              triggerAccount('position')
            },
            renderValue: selected => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {selected.map(value => (
                  <CustomChip key={value.id} label={value.name} sx={{ m: 0.75 }} skin='light' color='primary' />
                ))}
              </Box>
            )
          }}
        >
          {storePositions.positions.map(position => (
            <MenuItem key={position.id} value={position}>
              {position.name}
            </MenuItem>
          ))}
        </CustomTextField>
      </Grid>

      <Grid item xs={12} textAlign={'right'}>
        <Button
          color='primary'
          variant='contained'
          onClick={handleAccountSubmit(onSubmit)}
        >Save
        </Button>

      </Grid>
    </Grid>
  )
}

export default EditorControlled
