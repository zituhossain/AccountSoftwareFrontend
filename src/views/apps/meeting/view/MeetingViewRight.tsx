import { useState } from 'react'
import { Checkbox, Box, Typography } from '@mui/material'
import Icon from '@mui/material/Icon'
import { putDataToApi } from 'src/utils/api'

import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import MuiTab, { TabProps } from '@mui/material/Tab'
import { styled } from '@mui/material/styles'

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1)
  }
}))

const MeetingViewRight = ({ meetingData }: { meetingData: any }) => {
  const [agreedUsers, setAgreedUsers] = useState(
    meetingData?.attributes?.agreed_users?.data?.map((u: { id: any }) => u.id)
  )

  const currentUserId = JSON.parse(localStorage.getItem('userData') || '{}').id

  const handleAgree = async (userId: number) => {
    const updatedAgreedUsers = agreedUsers.includes(userId)
      ? agreedUsers.filter((id: number) => id !== userId)
      : [...agreedUsers, userId]

    setAgreedUsers(updatedAgreedUsers)

    // Update the backend
    const formData = new FormData()
    formData.append('data', JSON.stringify({ agreed_users: updatedAgreedUsers }))
    await putDataToApi(`/meetings/${meetingData.id}`, formData)
  }

  return (
    <TabContext>
      <TabList variant='scrollable' scrollButtons='auto' aria-label='forced scroll tabs example'>
        <Tab value='overview' label='Signature of Users' icon={<Icon icon='mdi:account-outline' />} />
      </TabList>
      <Box sx={{ mt: 6 }}>
        {meetingData?.attributes?.meeting_users?.data?.map((user: any) => (
          <Box key={user.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Checkbox
              checked={agreedUsers.includes(user.id)}
              onChange={() => handleAgree(user.id)}
              disabled={currentUserId !== user.id}
            />
            <Typography variant='body1'>{user?.attributes?.username}</Typography>
          </Box>
        ))}
      </Box>
    </TabContext>
  )
}

export default MeetingViewRight
