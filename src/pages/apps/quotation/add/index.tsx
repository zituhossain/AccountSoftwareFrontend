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
import { fetchDataFromApi, postDataToApi } from 'src/utils/api'
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
    const fetchPositions = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData')!)
        const userResponse = await fetchDataFromApi(`/users/${userData.id}?populate=company`)
        console.log('uderResponse', userData.id)

        // Fetch the latest quotation number
        const quoteResponse = await fetchDataFromApi(`/quotations`)
        console.log('quoteResponse', quoteResponse.data)

        // Extract IDs from each quotation object
        const ids = quoteResponse.length > 0 ? quoteResponse.data.map((quote: any) => quote.attributes.quotation_no) : 0

        // Find the maximum ID
        console.log('ids', ids)
        const maxId = Math.max(...ids)

        // Generate the next quotation number
        const nextQuotationNumber = maxId + 1
        setQuotationNo(nextQuotationNumber)

        // Merge the changes into the existing formData state
        setFormData(prevState => ({
          ...prevState,
          quotation_no: nextQuotationNumber.toString(),
          created_user: userData.id,
          company: userResponse.company.id
        }))
      } catch (error) {
        console.error('Error fetching positions:', error)
      }
    }
    fetchPositions()
  }, [])

  // Function to save data
  const handleSave = async () => {
    const data = new FormData()
    data.append('data', JSON.stringify(formData))

    const response = await postDataToApi('/quotations', data)
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

  console.log('quotationNo', quotationNo)

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
