import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import React from 'react'
import PageHeader from 'src/@core/components/page-header'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import EditorControlled from 'src/views/apps/announcements/EditorControlled'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const AddAnnouncement = () => {
    return (
        <EditorWrapper>
            <Grid container spacing={6} className='match-height'>
                <PageHeader
                    title={
                        <Typography variant='h4'>
                            Add Announcement
                        </Typography>
                    }
                    subtitle={<Typography sx={{ color: 'text.secondary' }}>You can add new announcement here</Typography>}
                />
                <Grid item xs={12}>
                    <Card>
                        <CardHeader title='Rich Text Editor' subheader='Use the rich text editor to create announcement' />
                        <CardContent>
                            <EditorControlled />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </EditorWrapper>
    )
}

export default AddAnnouncement