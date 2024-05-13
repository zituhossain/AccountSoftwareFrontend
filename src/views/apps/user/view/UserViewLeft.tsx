// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Icon Imports

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomChip from 'src/@core/components/mui/chip'
import UserSubscriptionDialog from 'src/views/apps/user/view/UserSubscriptionDialog'
import UserSuspendDialog from 'src/views/apps/user/view/UserSuspendDialog'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/allTypes'

// ** Utils Import
import router from 'next/router'
import { getInitials } from 'src/@core/utils/get-initials'
import { STRAPI_URL } from 'src/utils/urls'

interface ColorsType {
  [key: string]: ThemeColor
}

const statusColors: ColorsType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

const UserViewLeft = ({ userData }: { userData: any }) => {
  console.log('user', userData)

  // ** States
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState<boolean>(false)

  const handleEdit = (id: string | number) => {
    router.push(`/apps/user/add?id=${id}`)
  }

  const { username, email, company, confirmed, organizational_position, user_profile } = userData

  const imageUrl = `${STRAPI_URL}${userData?.user_profile?.profile?.url}`

  if (userData) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {imageUrl ? (
                <CustomAvatar
                  src={imageUrl}
                  variant='rounded'
                  alt={user_profile?.profile?.name}
                  sx={{
                    width: 250,
                    height: 250,
                    fontWeight: 600,
                    mb: 4,
                    '& img': {
                      objectFit: 'cover'
                    }
                  }}
                />
              ) : (
                <CustomAvatar
                  skin='light'
                  variant='rounded'
                  color={data.avatarColor as ThemeColor}
                  sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
                ></CustomAvatar>
              )}
            </CardContent>

            <CardContent>
              <Typography variant='h6'>Details</Typography>
              <Divider sx={{ mt: theme => `${theme.spacing(4)} !important` }} />
              <Box sx={{ pt: 2, pb: 1 }}>
                {username && (
                  <Box sx={{ display: 'flex', mb: 2.7 }}>
                    <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                      Name:
                    </Typography>
                    <Typography variant='body2'>{username}</Typography>
                  </Box>
                )}

                {user_profile?.phone && (
                  <Box sx={{ display: 'flex', mb: 2.7 }}>
                    <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                      Phone:
                    </Typography>
                    <Typography variant='body2'>{user_profile.phone}</Typography>
                  </Box>
                )}

                {email && (
                  <Box sx={{ display: 'flex', mb: 2.7 }}>
                    <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                      Email:
                    </Typography>
                    <Typography variant='body2'>{email}</Typography>
                  </Box>
                )}

                {user_profile?.address && (
                  <Box sx={{ display: 'flex', mb: 2.7 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Address:</Typography>
                    <Typography variant='body2'>{user_profile.address}</Typography>
                  </Box>
                )}

                {company && (
                  <Box sx={{ display: 'flex', mb: 2.7 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Company:</Typography>
                    <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                      {company.name}
                    </Typography>
                  </Box>
                )}

                {organizational_position && (
                  <Box sx={{ display: 'flex', mb: 2.7 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Position:</Typography>
                    <Typography variant='body2'>{organizational_position.title}</Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                    Status:
                  </Typography>
                  <CustomChip
                    skin='light'
                    size='small'
                    label={confirmed === true ? 'Active' : 'Inactive'}
                    color={statusColors[confirmed === true ? 'active' : 'inactive']}
                    sx={{
                      height: 20,
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      borderRadius: '5px',
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='contained' sx={{ mr: 2 }} onClick={() => handleEdit(userData.id)}>
                Edit
              </Button>
            </CardActions>

            <UserSuspendDialog open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
            <UserSubscriptionDialog open={subscriptionDialogOpen} setOpen={setSubscriptionDialogOpen} />
          </Card>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default UserViewLeft
