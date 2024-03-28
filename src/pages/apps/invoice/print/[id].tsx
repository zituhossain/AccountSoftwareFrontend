// ** Next Import

// ** Third Party Imports

// ** Types

// ** Demo Components Imports
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { fetchDataFromApi } from 'src/utils/api'

import PrintPage from 'src/views/apps/invoice/print/PrintPage'

const InvoicePrint = () => {
  const router = useRouter()
  const { id } = router.query
  const [invoiceMasterData, setInvoiceMasterData] = useState(null)
  const [invoiceDetailsData, setInvoiceDetailsData] = useState(null)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        if (id) {
          const response = await fetchDataFromApi(`/invoice-masters/${id}?populate=*`)
          setInvoiceMasterData(response.data)
          const detailsResponse = await fetchDataFromApi(
            `/invoice-details?populate=*&filters[invoice_master][id][$eq]=${response.data.id}`
          )

          setInvoiceDetailsData(detailsResponse.data)
        }
      } catch (error) {
        console.error('Error fetching company details:', error)
      }
    }
    fetchCompanies()
  }, [id])

  return <PrintPage invoiceMasterData={invoiceMasterData} invoiceDetailsData={invoiceDetailsData} />
}

InvoicePrint.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

InvoicePrint.setConfig = () => {
  return {
    mode: 'light'
  }
}

export default InvoicePrint
