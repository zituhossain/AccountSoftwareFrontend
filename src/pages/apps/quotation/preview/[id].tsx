// ** Next Import
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

// ** Third Party Imports
import axios from 'axios'

// ** Types
import { InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
import Preview from 'src/views/apps/quotation/preview/Preview'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { fetchDataFromApi } from 'src/utils/api'

const QuotationPreview = () => {
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

  return <div>{quotationData ? <Preview quotationData={quotationData} /> : <p>Loading...</p>}</div>
}

export default QuotationPreview
