// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Third Party Components

// ** Types
import { InvoiceClientType } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
import AddActions from 'src/views/apps/invoice/add/AddActions'
import AddCard from 'src/views/apps/invoice/add/AddCard'

// ** Styled Component
import { useRouter } from 'next/navigation'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { fetchDataFromApi, postDataToApiAxios } from 'src/utils/api'
import toast from 'react-hot-toast'
import { cl } from '@fullcalendar/core/internal-common'

const InvoiceAdd = () => {
  // ** State
  const [addCustomerOpen, setAddCustomerOpen] = useState<boolean>(false)
  const [selectedClient, setSelectedClient] = useState<InvoiceClientType | null>(null)
  const [clients, setClients] = useState<any | undefined>()
  const [invoiceNo, setInvoiceNo] = useState<number>(0)
  const [invoiceDetails, setInvoiceDetails] = useState<any[]>([])
  const [invoiceMasterId, setInvoiceMasterId] = useState<number>(0)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [invoiceMasterData, setInvoiceMasterData] = useState<any>({
    invoice_no: '1',
    client: '',
    date: new Date(),
    subject: '',
    bl_number: '',
    lc_number: '',
    remarks: '',
    created_user: 0,
    company: 0,
    status: true,
    total_amount: 0
  })

  console.log('invoiceMasterData:', invoiceMasterData)

  console.log('invoiceMasterId:', invoiceMasterId)

  console.log('totalAmount:', totalAmount)

  const router = useRouter()

  useEffect(() => {
    const fetchQuotationData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData')!)
        const userResponse = await fetchDataFromApi(`/users/${userData.id}?populate=company`)

        // Fetch Invoice Master data
        const invoiceMasterResponse = await fetchDataFromApi(`/invoice-masters`)

        if (invoiceMasterResponse && invoiceMasterResponse.data && invoiceMasterResponse.data.length > 0) {
          // Extract quotation numbers from each quotation object
          const invoiceNumbers = invoiceMasterResponse.data.map((invoice: any) =>
            parseInt(invoice.attributes.invoice_no, 10)
          )

          console.log('invoiceNumbers:', invoiceNumbers)

          // Find the maximum quotation number
          const maxInvoiceNumber = Math.max(...invoiceNumbers)

          console.log('maxInvoiceNumber:', maxInvoiceNumber)

          // Generate the next quotation number
          const nextQuotationNumber = maxInvoiceNumber + 1

          console.log('nextQuotationNumber:', nextQuotationNumber)

          // Set the next quotation number
          setInvoiceNo(nextQuotationNumber)

          // Merge the changes into the existing formData state
          setInvoiceMasterData((prevState: any) => ({
            ...prevState,
            invoice_no: nextQuotationNumber.toString(),
            created_user: userData.id,
            company: userResponse.company.id
          }))

          const invoiceMasters = invoiceMasterResponse.data // Assuming data holds the actual data

          // Assuming the ID field is called "id"
          const maxId = Math.max(...invoiceMasters.map((invoice: any) => invoice.id))

          console.log('maxId:', maxId)
          setInvoiceMasterId(maxId) // TODO: Add 1 to the maxId to get the next invoice number
        } else {
          // If no quotations exist, set the quotation number to 1
          setInvoiceNo(1)

          // Merge the changes into the existing formData state with quotation number as 1
          setInvoiceMasterData((prevState: any) => ({
            ...prevState,
            invoice_no: '1',
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

  // Calculate and update total amount whenever invoice details change
  useEffect(() => {
    const calculateTotalAmount = () => {
      let total = 0
      invoiceDetails.forEach(detail => {
        const rate = Number(detail.rate) ? Number(detail.rate) : 0
        const overweight = Number(detail.overweight) ? Number(detail.overweight) : 0
        const detailTotal = rate + overweight
        total += detailTotal
      })

      return total
    }

    // Call the calculateTotalAmount function and update totalAmount state
    setTotalAmount(calculateTotalAmount())
    setInvoiceMasterData((prevState: any) => ({
      ...prevState,
      total_amount: calculateTotalAmount()
    }))
  }, [invoiceDetails])

  // Function to save data
  const handleSave = async () => {
    try {
      // Add invoice master
      const masterData = new FormData()
      masterData.append('data', JSON.stringify(invoiceMasterData))
      const invoiceMasterResponse = await postDataToApiAxios('/invoice-masters', masterData)

      console.log('invoiceMasterResponse:', invoiceMasterResponse.data.id)

      if (!invoiceMasterResponse) {
        toast.error('Something went wrong! Please try again.')

        return
      }

      for (const detail of invoiceDetails) {
        const detailData = new FormData()
        detailData.append(
          'data',
          JSON.stringify({
            invoice_master: invoiceMasterResponse?.data.id,
            ...detail
          })
        )
        const response = await postDataToApiAxios('/invoice-details', detailData)

        if (response) {
          // router.push(`/apps/quotation/preview/${response.data.id}`)
          // toast.success('Invoice added successfully')
        } else {
          toast.error('Something went wrong! Please try again.')
          console.log('Error adding invoice details:', response)

          return
        }
      }
      router.push(`/apps/invoice/list`)
      toast.success('Invoice added successfully')
    } catch (error) {
      console.error('Error adding invoice details:', error)
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
            invoiceNumber={invoiceNo}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            toggleAddCustomerDrawer={toggleAddCustomerDrawer}
            invoiceMasterData={invoiceMasterData}
            setInvoiceMasterData={setInvoiceMasterData}
            invoiceDetails={invoiceDetails}
            setInvoiceDetails={setInvoiceDetails}
            invoiceMasterId={invoiceMasterId}
          />
        </Grid>
        <Grid item xl={3} md={4} xs={12}>
          <AddActions handleSave={handleSave} />
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default InvoiceAdd
