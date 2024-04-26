// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Types

// ** Demo Components Imports
import PayableViewLeft from './PayableViewLeft'
import PayableViewRight from './PayableViewRight'

type Props = {
  companyData: any
  quotationData: any
  transactionData: any
}

const PayableViewPage = ({ companyData, quotationData, transactionData }: Props) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={3}>
        <PayableViewLeft companyData={companyData} />
      </Grid>
      <Grid item xs={12} md={7} lg={9}>
        <PayableViewRight quotationData={quotationData} transactionData={transactionData} />
      </Grid>
    </Grid>
  )
}

export default PayableViewPage
