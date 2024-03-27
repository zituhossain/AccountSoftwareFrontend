// ** React Imports
import { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Third Party Components

// ** Types
import { InvoiceClientType } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
// import AddActions from 'src/views/apps/quotation/add/AddActions'
import AddCard from 'src/views/apps/quotation/add/AddCard'

// ** Styled Component
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { CompanyType, QuotationType } from 'src/types/apps/userTypes'
import { fetchDataFromApi, postDataToApiAxios, putDataToApi } from 'src/utils/api'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'

// Validation Schema
const schema = yup.object().shape({
  client_rate: yup.number().required('Client rate is required'),
  our_rate: yup.number().required('Our rate is required')
})

const QuotationAdd = () => {
  const router = useRouter()
  const { id } = router.query

  // ** State
  const [initialData, setInitialData] = useState(null)
  const [addCustomerOpen, setAddCustomerOpen] = useState<boolean>(false)
  const [selectedClient, setSelectedClient] = useState<QuotationType | null>(null)
  const [clients, setClients] = useState<CompanyType[] | undefined>()
  const [quotationNo, setQuotationNo] = useState<number>(0)

  console.log('initialData', initialData)
  console.log('clients', clients)

  const [formData, setFormData] = useState<QuotationType>({
    quotation_no: '1',
    client: '',
    date: new Date(),
    subject: '',
    bl_number: '',
    lc_number: '',
    remarks: '',
    client_rate: 0,
    our_rate: 0,
    no_of_items: 0,
    overweight: 0,
    status: true,
    send_status: false,
    revision_count: 0,
    created_user: '',
    company: ''
  })

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    const fetchQuotationData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData')!)
        if (userData && userData.id) {
          const userResponse = await fetchDataFromApi(`/users/${userData.id}?populate=company`)

          if (userResponse && userResponse.company && userResponse.company.id) {
            // Fetch the latest quotation data
            const quoteResponse = await fetchDataFromApi(`/quotations`)

            if (quoteResponse && quoteResponse.data && quoteResponse.data.length > 0) {
              // Extract quotation numbers from each quotation object
              const quotationNumbers = quoteResponse.data.map((quote: any) =>
                parseInt(quote.attributes.quotation_no, 10)
              )

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
          }
        }
      } catch (error) {
        console.error('Error fetching quotation data:', error)
      }
    }

    fetchQuotationData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await fetchDataFromApi(`/quotations/${id}?populate=*`)
          const {
            data: { attributes }
          } = response
          console.log('attt', attributes)
          if (attributes.date) {
            attributes.date = new Date(attributes.date) // Convert string to Date object
          }
          setInitialData(attributes)
          reset(attributes)
          console.log('attributes', attributes)
        } catch (error) {
          toast.error('Error fetching quotation data.')
          console.error('Error:', error)
        }
      }
    }

    fetchData()
  }, [id, reset])

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData()
      const extendedData = {
        ...data,
        quotation_no: quotationNo.toString(), // Ensure quotation number is a string if necessary
        client: selectedClient ? selectedClient.id : '' // Assuming selectedClient has an id property
      }
      formData.append('data', JSON.stringify(extendedData))
      if (id) {
        await putDataToApi(`/quotations/${id}`, formData)
        toast.success('Quotation updated successfully.')
      } else {
        await postDataToApiAxios('/quotations', formData)
        toast.success('Quotation added successfully.')
      }
      router.push(`/apps/quotation/list`)
    } catch (error) {
      toast.error('Something went wrong, please try again.')
      console.error('Submit Error:', error)
    }
  }

  // Function to save data
  // const handleSave = async () => {
  //   const data = new FormData()
  //   data.append('data', JSON.stringify(formData))

  //   const response = await postDataToApiAxios('/quotations', data)
  //   if (response) {
  //     router.push(`/apps/quotation/preview/${response.data.id}`)
  //     toast.success('Quotation added successfully')
  //   } else {
  //     toast.error('Something went wrong! Please try again.')
  //   }
  // }

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid item xl={9} md={8} xs={12}>
            <Card>
              <CardContent>
                {/* Pass control and errors to AddCard */}
                <AddCard
                  clients={clients}
                  invoiceNumber={quotationNo}
                  selectedClient={selectedClient}
                  setSelectedClient={setSelectedClient}
                  toggleAddCustomerDrawer={toggleAddCustomerDrawer}
                  setFormData={setFormData}
                  formData={formData}
                  control={control}
                  errors={errors}
                  initialData={initialData}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xl={3} md={4} xs={12}>
            <Card>
              <CardContent>
                <CardActions>
                  <Button type='submit' fullWidth variant='outlined'>
                    {id ? 'Update Quotation' : 'Save Quotation'}
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
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
