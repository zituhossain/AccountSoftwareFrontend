// ** React Imports

// ** Next Import

// ** MUI Imports
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import Box from '@mui/material/Box'
import MuiTab, { TabProps } from '@mui/material/Tab'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Components Imports
import CompanyContactListTable from 'src/views/apps/company/view/CompanyContactListTable'

// ** Types

interface Props {
  contactPersonData: any
}

// ** Styled Tab component
const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1)
  }
}))

const UserViewRight = ({ contactPersonData }: Props) => {
  console.log('contactPersonData=======> Right View', contactPersonData)

  return (
    <TabContext>
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        aria-label='forced scroll tabs example'
        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
      >
        <Tab value='overview' label='Contact Person' icon={<Icon icon='mdi:account-outline' />} />
      </TabList>
      <Box sx={{ mt: 6 }}>
        <CompanyContactListTable contactPersonData={contactPersonData} />
      </Box>
    </TabContext>
  )
}

export default UserViewRight
