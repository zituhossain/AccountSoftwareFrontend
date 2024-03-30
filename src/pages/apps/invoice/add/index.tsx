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
import { useRouter } from 'next/router'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { deleteDataFromApi, fetchDataFromApi, postDataToApiAxios, putDataToApi } from 'src/utils/api'
import toast from 'react-hot-toast'
import { cl } from '@fullcalendar/core/internal-common'
import { useForm } from 'react-hook-form'

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

  const {
    control,
    formState: { errors }
  } = useForm({})

  console.log('invoiceMasterData:', invoiceMasterData)

  console.log('invoiceMasterId:', invoiceMasterId)

  console.log('totalAmount:', totalAmount)

  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData')!)
        const userResponse = await fetchDataFromApi(`/users/${userData.id}?populate=company`)

        // Fetch Invoice Master data
        const invoiceMasterResponse = await fetchDataFromApi(`/invoice-masters?populate=*`)

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

    fetchInvoiceData()
  }, [])

  // Calculate and update total amount whenever invoice details change
  useEffect(() => {
    const calculateTotalAmount = () => {
      let total = 0
      invoiceDetails.forEach(detail => {
        const rate = Number(detail.rate)
          ? Number(detail.rate)
          : Number(detail?.attributes?.rate)
          ? Number(detail?.attributes?.rate)
          : 0
        const overweight = Number(detail.overweight)
          ? Number(detail.overweight)
          : Number(detail?.attributes?.overweight)
          ? Number(detail?.attributes?.overweight)
          : 0

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

  // Determine mode based on the presence of 'id'
  const isEditMode = Boolean(id)

  useEffect(() => {
    if (isEditMode) {
      fetchInvoiceData(id)
    }
  }, [id])

  const fetchInvoiceData = async (invoiceId: string | string[] | undefined) => {
    try {
      const invoiceMasterResponse = await fetchDataFromApi(`/invoice-masters/${invoiceId}?populate=*`)
      setInvoiceMasterData(invoiceMasterResponse.data)
      const invoiceDetailsResponse = await fetchDataFromApi(
        `/invoice-details?filters[invoice_master][id][$eq]=${invoiceId}`
      )
      setInvoiceDetails(invoiceDetailsResponse.data)
    } catch (error) {
      console.error('Error fetching invoice data:', error)
      toast.error('Error fetching data.')
    }
  }

  const handleSave = async () => {
    if (isEditMode) {
      await updateInvoiceMasterAndDetails()
    } else {
      await addInvoiceMasterAndDetails()
    }
  }

  const addInvoiceMasterAndDetails = async () => {
    try {
      const masterData = new FormData()
      masterData.append('data', JSON.stringify(invoiceMasterData))
      const invoiceMasterResponse = await postDataToApiAxios('/invoice-masters', masterData)
      const invoiceMasterId = invoiceMasterResponse.data.id

      for (const detail of invoiceDetails) {
        const detailData = new FormData()
        detailData.append('data', JSON.stringify({ ...detail, invoice_master: invoiceMasterId }))
        await postDataToApiAxios('/invoice-details', detailData)
      }

      toast.success('Invoice added successfully')
      router.push(`/apps/invoice/preview/${invoiceMasterId}`)
    } catch (error) {
      console.error('Error adding invoice:', error)
      toast.error('Something went wrong, please try again.')
    }
  }

  const updateInvoiceMasterAndDetails = async () => {
    try {
      // Update the invoice master record
      const masterData = new FormData()
      masterData.append('data', JSON.stringify(invoiceMasterData))
      await putDataToApi(`/invoice-masters/${invoiceMasterData.id}?populate=*`, masterData)

      // Retrieve current invoice details from the API to compare with local state
      const currentDetailsResponse = await fetchDataFromApi(
        `/invoice-details?filters[invoice_master][id][$eq]=${invoiceMasterData.id}`
      )
      const currentDetails = currentDetailsResponse.data

      // Determine new, existing, and deleted details
      const newDetails = invoiceDetails.filter(detail => !detail.id)
      const updatedDetails = invoiceDetails.filter(detail => detail.id)
      const deletedDetailsIds = currentDetails
        .filter((currentDetail: { id: any }) => !invoiceDetails.find(detail => detail.id === currentDetail.id))
        .map((detail: { id: any }) => detail.id)

      // Add new invoice detail items
      for (const detail of newDetails) {
        const detailData = new FormData()
        detailData.append('data', JSON.stringify({ ...detail, invoice_master: invoiceMasterData.id }))
        await postDataToApiAxios('/invoice-details', detailData)
      }

      // Update existing invoice detail items
      for (const detail of updatedDetails) {
        const detailData = new FormData()
        detailData.append('data', JSON.stringify(detail))
        await putDataToApi(`/invoice-details/${detail.id}`, detailData)
      }

      // Delete removed invoice detail items
      for (const detailId of deletedDetailsIds) {
        await deleteDataFromApi(`/invoice-details/${detailId}`)
      }

      toast.success('Invoice updated successfully')
      router.push(`/apps/invoice/preview/${invoiceMasterData.id}`)
    } catch (error) {
      console.error('Error updating invoice:', error)
      toast.error('Something went wrong, please try again.')
    }
  }

  // Function to save data
  // const handleSave = async () => {
  //   let invoiceMasterId = 0
  //   try {
  //     // Begin the transaction

  //     // Add invoice master
  //     const masterData = new FormData()
  //     masterData.append('data', JSON.stringify(invoiceMasterData))
  //     const invoiceMasterResponse = await postDataToApiAxios('/invoice-masters', masterData)

  //     invoiceMasterId = invoiceMasterResponse.data.id

  //     console.log('invoiceMasterResponse:', invoiceMasterResponse.data.id)

  //     if (!invoiceMasterResponse) {
  //       toast.error('Something went wrong! Please try again.')

  //       // Roll back the transaction

  //       return
  //     }

  //     for (const detail of invoiceDetails) {
  //       const detailData = new FormData()
  //       detailData.append(
  //         'data',
  //         JSON.stringify({
  //           invoice_master: invoiceMasterResponse?.data.id,
  //           ...detail
  //         })
  //       )
  //       const response = await postDataToApiAxios('/invoice-details', detailData)

  //       if (!response) {
  //         toast.error('Something went wrong! Please try again.')

  //         // Roll back the transaction

  //         return
  //       }
  //     }

  //     // Commit the transaction
  //     router.push(`/apps/invoice/preview/${invoiceMasterResponse.data.id}`)
  //     toast.success('Invoice added successfully')
  //   } catch (error) {
  //     console.error('Error adding invoice details:', error)
  //     toast.error('Something went wrong! Please try again.')

  //     const invoiceDetailsResponse = await fetchDataFromApi(
  //       `/invoice-details?fields=id&filters[invoice_master][id][$eq]=${invoiceMasterId}`
  //     )
  //     invoiceDetailsResponse.data.forEach(async (detail: any) => {
  //       await deleteDataFromApi(`/invoice-details/${detail.id}`)
  //     })
  //     await deleteDataFromApi(`/invoice-masters/${invoiceMasterId}`)

  //     // Roll back the transaction
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
            control={control}
            errors={errors}
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
