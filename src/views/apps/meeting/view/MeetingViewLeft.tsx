// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Icon Imports

// ** Custom Components
import UserSubscriptionDialog from 'src/views/apps/user/view/UserSubscriptionDialog'
import UserSuspendDialog from 'src/views/apps/user/view/UserSuspendDialog'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import router from 'next/router'

interface ColorsType {
  [key: string]: ThemeColor
}

const statusColors: ColorsType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

const MeetingViewLeft = ({ meetingData }: { meetingData: any }) => {
  console.log('meetingData', meetingData)

  // ** States
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState<boolean>(false)

  const {
    attributes: { title, description, meeting_link, date }
  } = meetingData

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant='h6'>Details</Typography>
            <Divider sx={{ mt: theme => `${theme.spacing(4)} !important` }} />
            <Box sx={{ pt: 2, pb: 1 }}>
              {title && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                    Meeting Title:
                  </Typography>
                  <Typography variant='body2'>{title}</Typography>
                </Box>
              )}

              {date && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                    Meeting Time:
                  </Typography>
                  <Typography variant='body2'>{date}</Typography>
                </Box>
              )}

              {meeting_link && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Meeting Link:</Typography>
                  <Typography variant='body2'> {meeting_link}</Typography>
                </Box>
              )}

              {description && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Description:</Typography>
                  <Typography variant='body2'>{description}</Typography>
                </Box>
              )}
            </Box>
          </CardContent>

          <UserSuspendDialog open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
          <UserSubscriptionDialog open={subscriptionDialogOpen} setOpen={setSubscriptionDialogOpen} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default MeetingViewLeft
