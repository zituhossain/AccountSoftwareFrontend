// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Types

// ** Demo Components Imports
import MeetingViewLeft from 'src/views/apps/meeting/view/MeetingViewLeft'
import MeetingViewRight from 'src/views/apps/meeting/view/MeetingViewRight'

type Props = {
  meetingData: any
}

const MeetingView = ({ meetingData }: Props) => {
  console.log('meetingData', meetingData)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <MeetingViewLeft meetingData={meetingData} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <MeetingViewRight meetingData={meetingData} />
      </Grid>
    </Grid>
  )
}

export default MeetingView
