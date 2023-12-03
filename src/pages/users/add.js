import { Grid, Typography } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import PageHeader from 'src/@core/components/page-header'
import StepperCustomHorizontal from 'src/views/apps/user/StepperCustomHorizontal'
import StepperLinearWithValidation from 'src/views/apps/user/StepperLinearWithValidation'

const AddUser = () => {

    return (
        <Grid container spacing={6}>
            <PageHeader
                title={
                    <Typography variant='h4'>
                        New User
                    </Typography>
                }
                subtitle={
                    <Typography sx={{ color: 'text.secondary' }}>
                        You can create a new user here.
                    </Typography>
                }
            />
            <Grid item xs={12}>
                {/* <StepperCustomHorizontal /> */}
                <StepperLinearWithValidation />

            </Grid>
        </Grid>
    )
}

AddUser.acl = {
    action: true,
    subject: 'can_create_user'
}

export default AddUser