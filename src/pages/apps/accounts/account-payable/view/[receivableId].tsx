import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { fetchDataFromApi } from 'src/utils/api'
import PayableViewPage from 'src/views/apps/accounts/account-payable/view/PayableViewPage'

const ReceivableDetails = () => {
  const router = useRouter()
  const { receivableId } = router.query
  const [companyData, setCompanyData] = useState(null)
  const [quotationData, setQuotationData] = useState([])
  const [transactionData, setTransactionData] = useState([])

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (receivableId) {
          const response = await fetchDataFromApi(`/journals/${receivableId}?populate=client,quotation,client.logo`)
          setCompanyData(response.data.attributes.client.data)

          // Quotation Response
          const quotationId = response.data.attributes.quotation.data.id
          const QuotationDetailsResponse = await fetchDataFromApi(`/quotations/${quotationId}`)
          setQuotationData(QuotationDetailsResponse.data)

          // Transaction Response
          const transactionResponse = await fetchDataFromApi(
            `/transactions?populate=*&filters[quotation][id][$eq]=${quotationId}`
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
        <PayableViewPage companyData={companyData} quotationData={quotationData} transactionData={transactionData} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default ReceivableDetails
