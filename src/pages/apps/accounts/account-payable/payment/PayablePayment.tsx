import { du } from '@fullcalendar/core/internal-common'
import { yupResolver } from '@hookform/resolvers/yup' // Import yupResolver for schema validation
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { fetchDataFromApi, postDataToApiAxios } from 'src/utils/api'
import * as yup from 'yup' // Import yup for schema definition

const PayablePayment = ({
  open,
  onClose,
  title,
  paymentId,
  dueAmountById
}: {
  open: boolean
  onClose: () => void
  title: string
  paymentId: string | number
  dueAmountById: number
}) => {
  const router = useRouter()

  const [selectedQuotation, setSelectedQuotation] = useState<any>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [companyId, setCompanyId] = useState<number | null>(null)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [accountHeader, setAccountHeader] = useState<number | null>(null)
  const [client, setClient] = useState<number | null>(null)

  console.log('totalAmount', totalAmount)

  const schema = yup.object().shape({
    payment_option: yup.number().required('Payment Option is required'),
    paid_amount: yup.number().required('Paid Amount is required')
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema) // Add resolver for schema validation
  })

  useEffect(() => {
    ;(async () => {
      if (paymentId !== null) {
        try {
          const userData = JSON.parse(localStorage.getItem('userData')!)
          const userResponse = await fetchDataFromApi(`/users/${userData.id}?populate=company`)

          if (userResponse) {
            setUserId(userResponse.id)
            if (userResponse.company) setCompanyId(userResponse.company.id)
          }

          const response = await fetchDataFromApi(`/journals/${paymentId}?populate=*`)
          setTotalAmount(response.data.attributes.amount)
          setSelectedQuotation(response.data.attributes.quotation.data)
          setAccountHeader(response.data.attributes.credit_account.data.id)
          setClient(response.data.attributes.client.data.id)
        } catch (error) {
          console.error('Error fetching payment details:', error)
          toast.error('Failed to fetch payment details')
        }
      }
    })()
  }, [paymentId])

  const onSubmit = async (data: any) => {
    console.log('data:', data)
    try {
      let accountId

      // Fetch debit account ID based on payment option
      if (data.payment_option === 0) {
        const response = await fetchDataFromApi(`/individual-accounts?filters[short_name]=ca`)
        accountId = response.data[0].id
      } else if (data.payment_option === 1) {
        const response = await fetchDataFromApi(`/individual-accounts?filters[short_name]=ba`)
        accountId = response.data[0].id
      } else if (data.payment_option === 2) {
        const response = await fetchDataFromApi(`/individual-accounts?filters[short_name]=ma`)
        accountId = response.data[0].id
      }

      const formData = new FormData()
      formData.append(
        'data',
        JSON.stringify({
          company: companyId,
          created_user: userId,
          paid_amount: data.paid_amount,
          due_amount: dueAmountById - data.paid_amount,
          payment_option: data.payment_option,
          total_amount: totalAmount,
          account_header: accountHeader, // Assuming this is an ID
          client: client, // Assuming this is an ID
          quotation: selectedQuotation?.id // Assuming this is how you're setting the invoice ID
        })
      )

      // Add new Transaction
      await postDataToApiAxios('/transactions', formData)

      // Journal Entry
      const journalData = new FormData()
      journalData.append(
        'data',
        JSON.stringify({
          quotation: selectedQuotation?.id,
          amount: data.paid_amount,
          credit_account: accountId,
          debit_account: accountHeader,
          created_user: userId,
          company: companyId,
          client: client
        })
      )
      await postDataToApiAxios('/journals', journalData)

      toast.success('Payable Amount Payment successfully')

      router.push('/apps/accounts/transaction')
    } catch (error: any) {
      toast.error('Error adding Transaction')
      console.error('Error adding Transaction:', error.message)
    }

    // Close the dialog
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              margin='dense'
              id='due-amount'
              label='Due Amount'
              type='number'
              fullWidth
              disabled
              value={dueAmountById}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <InputLabel id='payment_option'>Payment Option</InputLabel>
              <Controller
                name='payment_option'
                control={control}
                render={({ field }) => (
                  <Select {...field} label='Payment Option' labelId='payment_option'>
                    <MenuItem value={0}>Cash</MenuItem>
                    <MenuItem value={1}>Check</MenuItem>
                    <MenuItem value={2}>MFS</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <Controller
                name='paid_amount'
                control={control}
                render={({ field }) => (
                  <TextField {...field} label='Paid Amount' type='number' variant='outlined' fullWidth />
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} color='primary' autoFocus>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PayablePayment
