// ** Next Import

// ** Third Party Imports

// ** Types

// ** Demo Components Imports
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { fetchDataFromApi } from 'src/utils/api'

import PrintPage from 'src/views/apps/quotation/print/PrintPage'

const QuotationPrint = () => {
  const router = useRouter()
  const { id } = router.query
  const [quotationData, setQuotationData] = useState(null)

  console.log('quotationData: from preview id page', quotationData)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        if (id) {
          const response = await fetchDataFromApi(`/quotations/${id}?populate=*`)
          setQuotationData(response.data)
        }
      } catch (error) {
        console.error('Error fetching company details:', error)
      }
    }
    fetchCompanies()
  }, [id])

  return <PrintPage quotationData={quotationData} />
}

QuotationPrint.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

QuotationPrint.setConfig = () => {
  return {
    mode: 'light'
  }
}

export default QuotationPrint
