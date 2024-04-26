import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ReceivableViewPage from 'src/views/apps/accounts/account-receivable/view/ReceivableViewPage'
import { fetchDataFromApi } from 'src/utils/api'

const ReceivableDetails = () => {
  const router = useRouter()
  const { receivableId } = router.query
  const [companyData, setCompanyData] = useState(null)
  const [invoiceData, setInvoiceData] = useState([])
  const [transactionData, setTransactionData] = useState([])

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (receivableId) {
          const response = await fetchDataFromApi(`/journals/${receivableId}?populate=client,invoice,client.logo`)
          setCompanyData(response.data.attributes.client.data)

          console.log('zitu=======>', response.data.attributes.client.data)

          // Invoice Response
          const invoiceId = response.data.attributes.invoice.data.id
          const invoiceDetailsResponse = await fetchDataFromApi(
            `/invoice-details?populate=*&filters[invoice_master][id][$eq]=${invoiceId}`
          )
          setInvoiceData(invoiceDetailsResponse.data)

          // Transaction Response
          const transactionResponse = await fetchDataFromApi(
            `/transactions?populate=*&filters[invoice_id][id][$eq]=${invoiceId}`
          )
          setTransactionData(transactionResponse.data)
        }
      } catch (error) {
        console.error('Error fetching receivable details:', error)
      }
    }
    fetchDetails()
  }, [receivableId])

  return (
    <div>
      {companyData ? (
        <ReceivableViewPage companyData={companyData} invoiceData={invoiceData} transactionData={transactionData} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default ReceivableDetails
