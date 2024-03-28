// ** Next Import

// ** Third Party Imports

// ** Types

// ** Demo Components Imports
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { fetchDataFromApi } from 'src/utils/api'
import Preview from 'src/views/apps/invoice/preview/Preview'

const QuotationPreview = () => {
  const router = useRouter()
  const { id } = router.query
  const [invoiceMasterData, setInvoiceMasterData] = useState(null)
  const [invoiceDetailsData, setInvoiceDetailsData] = useState(null)

  console.log('quotationData: from preview id page', invoiceMasterData)

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

  return (
    <div>
      {invoiceMasterData && invoiceDetailsData ? (
        <Preview invoiceMasterData={invoiceMasterData} invoiceDetailsData={invoiceDetailsData} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default QuotationPreview
