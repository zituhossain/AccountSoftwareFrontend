// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Types

// ** Demo Components Imports
import ReceivableViewLeft from 'src/views/apps/accounts/account-receivable/view/ReceivableViewLeft'
import ReceivableViewRight from 'src/views/apps/accounts/account-receivable/view/ReceivableViewRight'

type Props = {
  companyData: any
  invoiceData: any
  transactionData: any
}

const ReceivableView = ({ companyData, invoiceData, transactionData }: Props) => {
  console.log(companyData)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={3}>
        <ReceivableViewLeft companyData={companyData} />
      </Grid>
      <Grid item xs={12} md={7} lg={9}>
        <ReceivableViewRight invoiceData={invoiceData} transactionData={transactionData} />
      </Grid>
    </Grid>
  )
}

export default ReceivableView
