// ** React Imports
import { use, useEffect, useState } from 'react'

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
import { cl, co } from '@fullcalendar/core/internal-common'
import { Controller, useForm } from 'react-hook-form'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { AccountHeadType } from 'src/types/apps/userTypes'
import { set } from 'nprogress'

const InvoiceAdd = () => {
  // ** State
  const [addCustomerOpen, setAddCustomerOpen] = useState<boolean>(false)
  const [selectedClient, setSelectedClient] = useState<InvoiceClientType | null>(null)
  const [clients, setClients] = useState<any | undefined>()
  const [invoiceNo, setInvoiceNo] = useState<number>(0)
  const [invoiceDetails, setInvoiceDetails] = useState<any[]>([])
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [accountHeaders, setAccountHeaders] = useState<AccountHeadType[]>([])
  const [userId, setUserId] = useState<number>(0)
  const [companyId, setCompanyId] = useState<number>(0)
  const [accountHeaderId, setAccountHeaderId] = useState<string>('')
  const [paymentOption, setPaymentOption] = useState<string>('')
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

  console.log('accountHeaderId', accountHeaderId)

  const {
    control,
    formState: { errors }
  } = useForm({})

  console.log('selectedClient:========>', selectedClient?.id)

  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData')!)
        const userResponse = await fetchDataFromApi(`/users/${userData.id}?populate=company`)

        // Merge the changes into the existing formData state
        setInvoiceMasterData((prevState: any) => ({
          ...prevState,
          created_user: userData.id,
          company: userResponse.company.id
        }))
      } catch (error) {
        console.error('Error fetching quotation data:', error)
      }
    }

    fetchInvoiceData()
  }, [])

  useEffect(() => {
    const fetchInvoiceData = async () => {
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
          const maxInvoiceNo = Math.max(...invoices.map(invoice => parseInt(invoice.attributes.invoice_no, 10)))
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

    fetchInvoiceData()
  }, [id])

  // Fetch account headers
  useEffect(() => {
    const fetchAccountHeaders = async () => {
      try {
        const accountHeadersResponse = await fetchDataFromApi('/account-headers')
        setAccountHeaders(accountHeadersResponse.data)
      } catch (error) {
        console.error('Error fetching account headers:', error)
      }
    }

    fetchAccountHeaders()
  }, [])

  // Fetch User and Company ID
  useEffect(() => {
    const fetchRelationCompany = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData')!)
        const userResponse = await fetchDataFromApi(`/users/${userData.id}?populate=company`)

        if (userResponse) {
          setUserId(userResponse.id)
          if (userResponse.company) setCompanyId(userResponse.company.id)
        }
      } catch (error) {
        console.error('Error fetching positions:', error)
      }
    }
    fetchRelationCompany()
  }, [])

  const handleAccountHeader = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountHeaderId(event.target.value)
  }

  const handlePaymentOption = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentOption(event.target.value)
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

  useEffect(() => {
    if (isEditMode && id) {
      fetchInvoiceData(id)
    }
  }, [id, isEditMode])

  const fetchInvoiceData = async (invoiceId: string | string[] | undefined) => {
    try {
      const invoiceMasterResponse = await fetchDataFromApi(`/invoice-masters/${invoiceId}?populate=*`)
      setInvoiceMasterData(invoiceMasterResponse.data)
      const invoiceDetailsResponse = await fetchDataFromApi(
        `/invoice-details?filters[invoice_master][id][$eq]=${invoiceId}`
      )
      setInvoiceDetails(invoiceDetailsResponse.data)
      const transactionResponse = await fetchDataFromApi(
        `/transactions?populate=*&filters[invoice_id][id][$eq]=${invoiceId}`
      )
      const transactionData = transactionResponse.data[0]
      console.log('ztransactionData:', transactionData)

      if (transactionData) {
        setAccountHeaderId(transactionData?.account_headers?.data?.attributes?.head_title)
        setPaymentOption(transactionData.payment_option)
        setInvoiceMasterData(prevState => ({
          ...prevState,
          account_headers: transactionData.account_headers,
          payment_option: transactionData.payment_option
        }))
      }
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

      // Transaction Data
      const transactionData = new FormData()
      transactionData.append(
        'data',
        JSON.stringify({
          ...transactionData,
          invoice_id: invoiceMasterId,
          amount: totalAmount,
          account_headers: accountHeaderId,
          company: companyId,
          created_user: userId,
          payment_option: paymentOption,
          client: selectedClient?.id
        })
      )
      const transactionResponse = await postDataToApiAxios('/transactions', transactionData)
      console.log('transactionResponse:', transactionResponse.data)

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

      const transactionResponse = await fetchDataFromApi(
        `/transactions?filters[invoice_id][id][$eq]=${invoiceMasterData.id}`
      )
      const transactionId = transactionResponse.data[0].id // Assuming the first result is the correct one

      // Then, prepare and update the transaction data
      const transactionData = new FormData()
      transactionData.append(
        'data',
        JSON.stringify({
          amount: totalAmount,
          account_headers: accountHeaderId,
          company: companyId,
          created_user: userId,
          payment_option: paymentOption,
          client: selectedClient?.id
        })
      )
      await putDataToApi(`/transactions/${transactionId}`, transactionData)

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

  console.log('selectedClient:', selectedClient)

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
              <Grid container spacing={3}>
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
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default InvoiceAdd
