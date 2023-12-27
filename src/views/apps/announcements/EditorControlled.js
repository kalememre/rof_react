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
import { Box, Button, Card, CardContent, FormControl, FormControlLabel, FormHelperText, Grid, MenuItem, Radio, RadioGroup, Typography } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { getBranches } from 'src/store/apps/branch'
import { getPositions } from 'src/store/apps/position'
import { useDispatch, useSelector } from 'react-redux'
import { addAnnouncement } from 'src/store/apps/announcements'
import { useRouter } from 'next/router'

const EditorControlled = props => {

  const {
    accountErrors,
    accountControl,
    setAccountError,
    setValueAccount,
  } = props

  const [value, setValue] = useState(EditorState.createEmpty())
  const htmlValue = draftToHtml(convertToRaw(value.getCurrentContent()))

  return (
    <Card>
      <CardContent>
        <Grid container spacing={6} className='match-height'>
          <Grid item xs={12} sm={12}>
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
                  placeholder="Enter title"
                  error={Boolean(accountErrors.title)}
                  {...(accountErrors.title && { helperText: accountErrors.title.message })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <ReactDraftWysiwyg
              editorState={value}
              onEditorStateChange={data => {
                setValue(data)
                if (!data.getCurrentContent().hasText()) {
                  setAccountError('description', {
                    type: 'manual',
                    message: 'Description field is required'
                  })
                } else {
                  setAccountError('description', null)
                  setValueAccount('description', htmlValue)
                }
              }}
            />
            <FormHelperText error={Boolean(accountErrors.description)}>
              {accountErrors.description && accountErrors.description.message}
            </FormHelperText>
          </Grid>
        </Grid>
      </CardContent>
    </Card>

  )
}

export default EditorControlled
