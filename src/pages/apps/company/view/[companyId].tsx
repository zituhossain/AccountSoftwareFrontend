import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CompanyViewPage from 'src/views/apps/company/view/CompanyViewPage'
import { fetchDataFromApi } from 'src/utils/api'

const CompanyDetails = () => {
  const router = useRouter()
  const { companyId } = router.query
  const [companyData, setCompanyData] = useState(null)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        if (companyId) {
          const response = await fetchDataFromApi(`/companies/${companyId}?populate=*`)
          setCompanyData(response.data)
        }
      } catch (error) {
        console.error('Error fetching company details:', error)
      }
    }
    fetchCompanies()
  }, [companyId])

  return (
    <div>
      {companyData ? <CompanyViewPage companyData={companyData} tab={''} invoiceData={[]} /> : <p>Loading...</p>}
    </div>
  )
}

export default CompanyDetails
