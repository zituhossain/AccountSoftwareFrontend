// ** React Imports

// ** Next Import

// ** MUI Imports
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import MuiTab, { TabProps } from '@mui/material/Tab'
import { styled } from '@mui/material/styles'
import { useState } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Components Imports
import InvoiceListTable from 'src/views/apps/accounts/account-receivable/view/InvoiceListTable'
import TransactionListTable from 'src/views/apps/accounts/account-receivable/view/TransactionListTable'
import QuotationList from './QuotationListTable'

// ** Types

interface Props {
  quotationData: any
  transactionData: any
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

const PayableViewRight = ({ quotationData, transactionData }: Props) => {
  const [value, setValue] = useState('quotation') // State for active tab

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label='account details tabs'>
          <Tab value='quotation' label='Quotation' icon={<Icon icon='mdi:clipboard-outline' />} />
          <Tab value='transactions' label='Transactions' icon={<Icon icon='mdi:swap-horizontal-bold' />} />
        </TabList>
      </Box>
      <TabPanel value='quotation' sx={{ p: 0 }}>
        <QuotationList quotationData={quotationData} />
      </TabPanel>
      <TabPanel value='transactions' sx={{ p: 0 }}>
        <TransactionListTable transactionData={transactionData} />
      </TabPanel>
    </TabContext>
  )
}

export default PayableViewRight
