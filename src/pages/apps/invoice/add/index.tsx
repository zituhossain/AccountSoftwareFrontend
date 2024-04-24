// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Third Party Components

// ** Types
import { InvoiceClientType } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
import AddCard from 'src/views/apps/invoice/add/AddCard'

// ** Styled Component
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { AccountHeadType } from 'src/types/apps/userTypes'
import { deleteDataFromApi, fetchDataFromApi, postDataToApiAxios, putDataToApi } from 'src/utils/api'

const InvoiceAdd = () => {
  // ** State
  const [addCustomerOpen, setAddCustomerOpen] = useState<boolean>(false)
  const [selectedClient, setSelectedClient] = useState<InvoiceClientType | null>(null)
  const [clients, setClients] = useState<any | undefined>()
  const [invoiceNo, setInvoiceNo] = useState<number>(0)
  const [invoiceDetails, setInvoiceDetails] = useState<any[]>([])
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [accountHeaders, setAccountHeaders] = useState<AccountHeadType[]>([])
  const [accountHeaderId, setAccountHeaderId] = useState<string>('')
  const [paymentOption, setPaymentOption] = useState<any>(0)
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

  const router = useRouter()
  const { id } = router.query

  const handleAccountHeader = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountHeaderId(event.target.value)
  }

  const handlePaymentOption = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentOption(event.target.value)
  }

  // Initial data loading and setup
  useEffect(() => {
    // Fetch user and company data once on component mount
    const fetchInitialData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        const [userResponse, companyResponse] = await Promise.all([
          fetchDataFromApi(`/users/${userData.id}?populate=company`),
          fetchDataFromApi(`/b2b-relations?filters[id][$ne]=${userData.company?.id}?&populate=*`)
        ])

        // setAccountHeaders(accountHeadersResponse.data)
        setClients(companyResponse.data)

        // Setting initial invoice master data
        setInvoiceMasterData((prevState: any) => ({
          ...prevState,
          created_user: userData.id,
          company: userResponse.company.id
        }))
      } catch (error) {
        console.error('Initialization error:', error)
        toast.error('Error initializing data.')
      }
    }

    fetchInitialData()

    // Fetch additional data if in edit mode, or fetch new invoice number if creating a new invoice
    if (id) {
      fetchAllInvoiceData(id)
    } else {
      fetchInvoiceNumber()
    }
  }, [id]) // Dependency on 'id' ensures re-run only if 'id' changes.

  // Fetch invoice no
  const fetchInvoiceNumber = async () => {
    try {
      // Fetch existing invoice data if in edit mode
      if (id) {
        const invoiceMasterResponse = await fetchDataFromApi(`/invoice-masters/${id}`)
        console.log('invoiceMasterResponse:##########', invoiceMasterResponse.data)
        const existingInvoiceNo = invoiceMasterResponse?.data?.attributes?.invoice_no
        setInvoiceNo(existingInvoiceNo)
        setInvoiceMasterData((prevState: any) => ({
          ...prevState,
          invoice_no: existingInvoiceNo.toString()
        }))
      } else {
        // Generate new invoice number if creating new invoice
        const invoiceMasterResponse = await fetchDataFromApi(`/invoice-masters`)
        const invoices = invoiceMasterResponse?.data
        console.log('Create new invoice: ')
        const maxInvoiceNo = Math.max(
          ...invoices.map((invoice: { attributes: { invoice_no: string } }) =>
            parseInt(invoice.attributes.invoice_no, 10)
          )
        )
        const newInvoiceNo = maxInvoiceNo >= 0 ? maxInvoiceNo + 1 : 1
        setInvoiceNo(newInvoiceNo)

        // Merge the changes into the existing formData state
        setInvoiceMasterData((prevState: any) => ({
          ...prevState,
          invoice_no: newInvoiceNo.toString()
        }))
      }
    } catch (error) {
      console.error('Error fetching invoice data:', error)
      toast.error('Error fetching data.')
    }
  }

  const fetchAllInvoiceData = async (invoiceId: string | string[] | undefined) => {
    try {
      const invoiceMasterResponse = await fetchDataFromApi(`/invoice-masters/${invoiceId}?populate=*`)
      setInvoiceMasterData(invoiceMasterResponse.data)
      const invoiceDetailsResponse = await fetchDataFromApi(
        `/invoice-details?filters[invoice_master][id][$eq]=${invoiceId}`
      )
      setInvoiceDetails(invoiceDetailsResponse.data)

      // const transactionResponse = await fetchDataFromApi(
      //   `/transactions?populate=*&filters[invoice_id][id][$eq]=${invoiceId}`
      // )
      // const transactionData = transactionResponse.data[0]

      // if (transactionData) {
      //   setAccountHeaderId(transactionData?.attributes?.account_headers?.data?.id)
      //   setPaymentOption(transactionData?.attributes?.payment_option)
      //   setInvoiceMasterData((prevState: any) => ({
      //     ...prevState,
      //     account_headers: transactionData.account_headers,
      //     payment_option: transactionData.payment_option
      //   }))
      // }
    } catch (error) {
      console.error('Error fetching invoice data:', error)
      toast.error('Error fetching data.')
    }
  }

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

  const handleSave = async () => {
    if (isEditMode) {
      await updateInvoiceMasterAndDetails()
    } else {
      await addInvoiceMasterAndDetails()
    }
  }

  const addInvoiceMasterAndDetails = async () => {
    let invoiceMasterId = null

    try {
      const masterData = new FormData()
      masterData.append('data', JSON.stringify(invoiceMasterData))
      const invoiceMasterResponse = await postDataToApiAxios('/invoice-masters', masterData)
      invoiceMasterId = invoiceMasterResponse.data.id

      for (const detail of invoiceDetails) {
        const detailData = new FormData()
        detailData.append('data', JSON.stringify({ ...detail, invoice_master: invoiceMasterId }))
        await postDataToApiAxios('/invoice-details', detailData)
      }

      // Journal Data
      const userData = JSON.parse(localStorage.getItem('userData')!)
      const userResponse = await fetchDataFromApi(`/users/${userData.id}?populate=company`)
      const serviceRevenueId = await fetchDataFromApi(`/individual-accounts?filters[short_name][$eq]=sr`)
      const accountReceivableId = await fetchDataFromApi(`/individual-accounts?filters[short_name][$eq]=ar`)

      const journalData = new FormData()
      journalData.append(
        'data',
        JSON.stringify({
          invoice: invoiceMasterId,
          amount: totalAmount,
          credit_account: serviceRevenueId.data[0].id,
          debit_account: accountReceivableId.data[0].id,
          created_user: userData.id,
          company: userResponse.company.id,
          payment_option: paymentOption,
          client: selectedClient?.attributes?.client?.data?.id
        })
      )
      const journalResponse = await postDataToApiAxios('/journals', journalData)
      console.log('journalResponse:', journalResponse.data)

      toast.success('Invoice added successfully')
      router.push(`/apps/invoice/preview/${invoiceMasterId}`)
    } catch (error) {
      console.error('Error adding invoice details:', error)
      toast.error('Something went wrong! Please try again.')
      const invoiceDetailsResponse = await fetchDataFromApi(
        `/invoice-details?fields=id&filters[invoice_master][id][$eq]=${invoiceMasterId}`
      )
      invoiceDetailsResponse.data.forEach(async (detail: any) => {
        await deleteDataFromApi(`/invoice-details/${detail.id}`)
      })
      await deleteDataFromApi(`/invoice-masters/${invoiceMasterId}`)
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

      const journalResponse = await fetchDataFromApi(`/journals?filters[invoice][id][$eq]=${invoiceMasterData.id}`)
      const journalId = journalResponse.data[0].id // Assuming the first result is the correct one

      // const userData = JSON.parse(localStorage.getItem('userData')!)
      // const userResponse = await fetchDataFromApi(`/users/${userData.id}?populate=company`)

      const journalData = new FormData()
      journalData.append(
        'data',
        JSON.stringify({
          amount: totalAmount,
          client: selectedClient?.attributes?.client?.data?.id
        })
      )
      await putDataToApi(`/journals/${journalId}`, journalData)

      toast.success('Invoice updated successfully')
      router.push(`/apps/invoice/preview/${invoiceMasterData.id}`)
    } catch (error) {
      console.error('Error updating invoice:', error)
      toast.error('Something went wrong, please try again.')
    }
  }

  const toggleAddCustomerDrawer = () => setAddCustomerOpen(!addCustomerOpen)

  // useEffect(() => {
  //   ;(async () => {
  //     const userData = JSON.parse(localStorage.getItem('userData')!)
  //     const userResponse = await fetchDataFromApi(`/users/${userData.id}?populate=company`)

  //     const companyResponse = await fetchDataFromApi(`/companies?filters[id][$ne]=${userResponse.company.id}`)

  //     setClients(companyResponse.data)
  //   })()
  // }, [])

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
            control={control}
            errors={errors}
          />
        </Grid>
        <Grid item xl={3} md={4} xs={12}>
          <Card>
            <CardContent>
              <CardActions>
                <Button fullWidth variant='outlined' sx={{ mb: 3.5 }} onClick={handleSave}>
                  {isEditMode ? 'Update Invoice' : 'Save Invoice'}
                </Button>
              </CardActions>
              {/* <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.account_headers}>
                    <InputLabel id='account_headers'>Account Head</InputLabel>
                    <Controller
                      name='account_headers'
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label='Account Head'
                          labelId='account_headers'
                          value={accountHeaderId || ''}
                          onChange={handleAccountHeader}
                        >
                          <MenuItem value=''>Select Account Head</MenuItem>
                          {accountHeaders.map(accountHeader => (
                            <MenuItem key={accountHeader.id} value={accountHeader.id}>
                              {accountHeader?.attributes?.head_title}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='payment_option'>Payment Option</InputLabel>
                    <Controller
                      name='payment_option'
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label='Payment Option'
                          labelId='payment_option'
                          value={paymentOption}
                          onChange={handlePaymentOption}
                        >
                          <MenuItem value=''>Select Payment Option</MenuItem>
                          <MenuItem value={0}>Cash</MenuItem>
                          <MenuItem value={1}>On Account</MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid> */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default InvoiceAdd
