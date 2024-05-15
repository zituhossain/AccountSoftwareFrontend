// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'

// ** Types

// ** Demo Components Imports
import UserViewLeft from 'src/views/apps/user/view/UserViewLeft'
import UserViewRight from 'src/views/apps/user/view/UserViewRight'

type Props = {
  userData: any
}

const UserView = ({ userData }: Props) => {
  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} md={5} lg={4}>
          <UserViewLeft userData={userData} />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <Card>
            <CardHeader
              title='Update User Profile'
              sx={{ pb: 6, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
            />
            {/* <Divider sx={{ mb: 6 }} /> */}
            <UserViewRight />
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default UserView
