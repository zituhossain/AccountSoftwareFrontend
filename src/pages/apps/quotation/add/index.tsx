// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Third Party Components

// ** Types
import { InvoiceClientType } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
import AddActions from 'src/views/apps/quotation/add/AddActions'
import AddCard from 'src/views/apps/quotation/add/AddCard'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { CompanyType } from 'src/types/apps/userTypes'
import { fetchDataFromApi, postDataToApi, postDataToApiAxios } from 'src/utils/api'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const QuotationAdd = () => {
  // ** State
  const [addCustomerOpen, setAddCustomerOpen] = useState<boolean>(false)
  const [selectedClient, setSelectedClient] = useState<InvoiceClientType | null>(null)
  const [clients, setClients] = useState<CompanyType[] | undefined>()
  const [quotationNo, setQuotationNo] = useState<number>(0)
  const [formData, setFormData] = useState<any>({
    quotation_no: '1',
    client: '',
    date: new Date(),
    subject: '',
    bl_number: '',
    lc_number: '',
    remarks: '',
    client_rate: '',
    our_rate: '',
    no_of_items: '',
    overweight: '',
    status: true,
    send_status: false,
    revision_count: 0,
    created_user: 0,
    company: 0
  })

  const router = useRouter()

  useEffect(() => {
    const fetchQuotationData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData')!)
        const userResponse = await fetchDataFromApi(`/users/${userData.id}?populate=company`)

        // Fetch the latest quotation data
        const quoteResponse = await fetchDataFromApi(`/quotations`)

        if (quoteResponse && quoteResponse.data && quoteResponse.data.length > 0) {
          // Extract quotation numbers from each quotation object
          const quotationNumbers = quoteResponse.data.map((quote: any) => parseInt(quote.attributes.quotation_no, 10))

          // Find the maximum quotation number
          const maxQuotationNumber = Math.max(...quotationNumbers)

          // Generate the next quotation number
          const nextQuotationNumber = maxQuotationNumber + 1

          // Set the next quotation number
          setQuotationNo(nextQuotationNumber)

          // Merge the changes into the existing formData state
          setFormData(prevState => ({
            ...prevState,
            quotation_no: nextQuotationNumber.toString(),
            created_user: userData.id,
            company: userResponse.company.id
          }))
        } else {
          // If no quotations exist, set the quotation number to 1
          setQuotationNo(1)

          // Merge the changes into the existing formData state with quotation number as 1
          setFormData(prevState => ({
            ...prevState,
            quotation_no: '1',
            created_user: userData.id,
            company: userResponse.company.id
          }))
        }
      } catch (error) {
        console.error('Error fetching quotation data:', error)
      }
    }

    fetchQuotationData()
  }, [])

  // Function to save data
  const handleSave = async () => {
    const data = new FormData()
    data.append('data', JSON.stringify(formData))

    const response = await postDataToApiAxios('/quotations', data)
    if (response) {
      router.push('/apps/quotation/list')
      toast.success('Quotation added successfully')
    } else {
      toast.error('Something went wrong! Please try again.')
    }
  }

  const toggleAddCustomerDrawer = () => setAddCustomerOpen(!addCustomerOpen)

  useEffect(() => {
    ;(async () => {
      const userData = JSON.parse(localStorage.getItem('userData')!)
      const userResponse = await fetchDataFromApi(`/users/${userData.id}?populate=company`)

      const companyResponse = await fetchDataFromApi(`/companies?filters[id][$ne]=${userResponse.company.id}`)

      setClients(companyResponse.data)
    })()
  }, [])

  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
      <Grid container spacing={6}>
        <Grid item xl={9} md={8} xs={12}>
          <AddCard
            clients={clients}
            invoiceNumber={quotationNo}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            toggleAddCustomerDrawer={toggleAddCustomerDrawer}
            setFormData={setFormData}
            formData={formData}
          />
        </Grid>
        <Grid item xl={3} md={4} xs={12}>
          <AddActions handleSave={handleSave} />
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

// export const getStaticProps: GetStaticProps = async () => {
//   const clientResponse = await axios.get('/apps/invoice/clients')
//   const apiClientData: InvoiceClientType = clientResponse.data

//   const allInvoicesResponse = await axios.get('/apps/invoice/invoices', { params: { q: '', status: '' } })
//   const lastInvoiceNumber = Math.max(...allInvoicesResponse.data.allData.map((i: InvoiceType) => i.id))

//   return {
//     props: {
//       apiClientData,
//       invoiceNumber: lastInvoiceNumber + 1
//     }
//   }
// }

export default QuotationAdd
