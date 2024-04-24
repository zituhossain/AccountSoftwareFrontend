// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Types

// ** Demo Components Imports
import CompanyViewLeft from 'src/views/apps/company/view/CompanyViewLeft'
import CompanyViewRight from 'src/views/apps/company/view/CompanyViewRight'

type Props = {
  companyData: any
  contactPersonData: any
}

const CompanyView = ({ companyData, contactPersonData }: Props) => {
  console.log(companyData)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <CompanyViewLeft companyData={companyData} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <CompanyViewRight contactPersonData={contactPersonData} />
      </Grid>
    </Grid>
  )
}

export default CompanyView
