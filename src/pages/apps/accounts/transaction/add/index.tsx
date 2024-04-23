import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Typography
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/router'
import { FormEventHandler, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { AccountHeadType, CompanyType, TransactionType } from 'src/types/apps/userTypes'
import { fetchDataFromApi, postDataToApiAxios, putDataToApi } from 'src/utils/api'
import * as yup from 'yup'

const AddTransaction = () => {
  const router = useRouter()
  const { id } = router.query

  // State
  const [userId, setUserId] = useState<number>(0)
  const [companyId, setCompanyId] = useState<number>(0)
  const [companies, setCompanies] = useState<CompanyType[]>([])
  const [invoices, setInvoices] = useState([])
  const [quotation, setQuotation] = useState([])
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [selectedQuotation, setSelectedQuotation] = useState(null)
  const [totalAmount, setTotalAmount] = useState(0)
  const [paidAmount, setPaidAmount] = useState()
  const [totalPaidAmounts, setTotalPaidAmounts] = useState()
  const [dueAmount, setDueAmount] = useState(0)
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null)
  const [accountHeaders, setAccountHeaders] = useState<AccountHeadType[]>([])
  const [transactionImg, setTransactionImg] = useState<File | null>(null)
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [accountHeadId, setAccountHeadId] = useState<number | null>(null)
  const [accountId, setAccountId] = useState<number | null>(null)
  const [companyUser, setCompanyUser] = useState<any | null>(null)

  console.log('quotation', quotation)

  const schema = yup.object().shape({
    account_header: yup.string().required('Account Head is required'),
    payment_option: yup.number().required('Payment Option is required'),
    paid_amount: yup.number().required('Paid Amount is required')
  })

  const defaultValues: TransactionType = {
    account_header: 0,
    total_amount: 0,
    payment_option: 0,
    client: 0,
    status: true,
    notes: '',
    created_user: userId,
    company: companyId,
    paid_amount: 0,
    due_amount: 0
  }

  const handleInputImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const selectedFile = e.target.files[0]
      setTransactionImg(selectedFile)
      setImgSrc(URL.createObjectURL(selectedFile))
    }
  }

  const handleInputImageReset = () => {
    setTransactionImg(null)
    setImgSrc(null)
  }

  // const handlePaidAmountChange = e => {
  //   const newPaidAmount = parseFloat(e.target.value)
  //   setPaidAmount(newPaidAmount)
  //   if (accountId === 1) {
  //     const newDueAmount = (selectedInvoice.total_amount || 0) - (totalPaidAmounts + newPaidAmount)
  //     setDueAmount(newDueAmount)
  //   } else if (accountId === 2) {
  //     const newDueAmount = (selectedQuotation.client_rate || 0) - (totalPaidAmounts + newPaidAmount)
  //     setDueAmount(newDueAmount)
  //   }
  // }

  const handlePaidAmountChange = e => {
    const newPaidAmount = parseFloat(e.target.value)
    const maxDueAmount = selectedInvoice
      ? (selectedInvoice.total_amount || 0) - totalPaidAmounts
      : selectedQuotation
      ? (selectedQuotation.client_rate || 0) - totalPaidAmounts
      : 0

    if (newPaidAmount > maxDueAmount) {
      alert('Paid amount cannot be more than the due amount.')
      setPaidAmount(maxDueAmount) // Set paid amount to max possible due amount
      e.target.value = maxDueAmount // Adjust the field value if needed

      return // Exit the function to avoid further processing
    }

    setPaidAmount(newPaidAmount)

    if (accountId === 1) {
      const newDueAmount = (selectedInvoice.total_amount || 0) - (totalPaidAmounts + newPaidAmount)
      setDueAmount(newDueAmount)
    } else if (accountId === 2) {
      const newDueAmount = (selectedQuotation.client_rate || 0) - (totalPaidAmounts + newPaidAmount)
      setDueAmount(newDueAmount)
    }
  }

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors }
  } = useForm<TransactionType>({
    resolver: yupResolver(schema),
    defaultValues
  })

  useEffect(() => {
    ;(async () => {
      if (accountHeadId) {
        const accountHeadResponse = await fetchDataFromApi(
          `/individual-accounts?populate=account&filters[id]=${accountHeadId}`
        )
        setAccountId(accountHeadResponse.data[0].attributes.account.data.id)
      }
    })()
  }, [accountHeadId])

  useEffect(() => {
    const fetchRelationCompany = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData')!)
        const userResponse = await fetchDataFromApi(`/users/${userData.id}?populate=company`)

        if (userResponse) {
          setUserId(userResponse.id)
          if (userResponse.company) setCompanyId(userResponse.company.id)
        }

        const account_headers_response = await fetchDataFromApi('/individual-accounts')
        setAccountHeaders(account_headers_response.data)

        const company_response = await fetchDataFromApi(`/companies?filters[id][$ne]=${userResponse.company.id}`)
        setCompanies(company_response.data)

        const company_user_response = await fetchDataFromApi(`/users`)
        setCompanyUser(company_user_response)

        if (id) {
          const response = await fetchDataFromApi(`/transactions/${id}?populate=*`)
          const {
            data: { attributes }
          } = response

          setValue('client', attributes.client?.data?.id || 0)
          setValue('account_header', attributes.account_header?.data?.id || 0)
        }
      } catch (error) {
        console.error('Error fetching positions:', error)
      }
    }
    fetchRelationCompany()
  }, [id, setValue])

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await fetchDataFromApi(`/transactions/${id}?populate=*`)
          const {
            data: { attributes }
          } = response

          // Set the form values using reset
          reset({
            ...attributes,
            status: attributes.status || false
          })
        } catch (error: any) {
          console.error('Error fetching accounts header data:', error.message)
        }
      }
    }

    fetchData()
  }, [id, reset])

  useEffect(() => {
    const fetchInvoicesByClient = async () => {
      if (selectedClientId && accountId === 1) {
        try {
          const invoicesResponse = await fetchDataFromApi(`/transactions/invoicesByClient/${selectedClientId}`)
          setInvoices(invoicesResponse)
        } catch (error) {
          console.error('Failed to fetch invoices:', error)
        }
      } else if (selectedClientId && accountId === 2) {
        try {
          const quotationsResponse = await fetchDataFromApi(`/transactions/quotationsByClient/${selectedClientId}`)
          setQuotation(quotationsResponse)
        } catch (error) {
          console.error('Failed to fetch quotations:', error)
        }
      }
    }

    fetchInvoicesByClient()
  }, [selectedClientId, accountId]) // This effect runs whenever selectedClientId changes

  const fetchTotalPaidAmounts = async invoiceId => {
    try {
      const response = await fetchDataFromApi(`/transactions/sum-paid-amounts/${invoiceId}`)

      return response.totalPaid || 0
    } catch (error) {
      console.error('Failed to fetch total paid amounts:', error)

      return 0
    }
  }

  useEffect(() => {
    if (selectedInvoice) {
      setTotalAmount(selectedInvoice.total_amount || 0)

      fetchTotalPaidAmounts(selectedInvoice.id).then(totalPaid => {
        setTotalPaidAmounts(totalPaid)
        const initialDueAmount = (selectedInvoice.total_amount || 0) - totalPaid
        setDueAmount(initialDueAmount)
        setPaidAmount(0)
      })
    }
  }, [selectedInvoice])

  useEffect(() => {
    if (selectedQuotation) {
      setTotalAmount(selectedQuotation.client_rate || 0)

      fetchTotalPaidAmounts(selectedQuotation.id).then(totalPaid => {
        setTotalPaidAmounts(totalPaid)
        const initialDueAmount = (selectedQuotation.client_rate || 0) - totalPaid
        setDueAmount(initialDueAmount)
        setPaidAmount(0)
      })
    }
  }, [selectedQuotation])

  const onSubmit = async (data: TransactionType) => {
    console.log('Shakhawat=======>', data)
    data.company = companyId
    data.created_user = userId
    data.total_amount = totalAmount // Ensure this matches your schema and expectation
    data.paid_amount = paidAmount // Parse to float since your state stores this as string
    data.due_amount = dueAmount

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
          ...data,
          account_header: data.account_header, // Assuming this is an ID
          client: data.client != 0 ? data.client : null, // Assuming this is an ID
          invoice_id: selectedInvoice?.id, // Assuming this is how you're setting the invoice ID
          quotation: selectedQuotation?.id, // Assuming this is how you're setting the quotation ID
          employee: data.employee // Assuming this is an ID
        })
      )
      if (transactionImg) {
        formData.append('files.image', transactionImg)
      }

      if (id) {
        // Update existing contact
        await putDataToApi(`/transactions/${id}`, formData)
        toast.success('Transaction updated successfully')
      } else {
        // Add new Transaction
        await postDataToApiAxios('/transactions', formData)

        // Journal

        const accountHeadResponse = await fetchDataFromApi(
          `/individual-accounts?populate=account&filters[id]=${data.account_header}`
        )

        const journalData = new FormData()
        if (accountHeadResponse.data[0].attributes.account.data.id === 5) {
          journalData.append(
            'data',
            JSON.stringify({
              invoice: selectedInvoice?.id,
              amount: paidAmount,
              credit_account: accountId,
              debit_account: data.account_header,
              created_user: userId,
              company: companyId,
              client: data.client != 0 ? data.client : null,
              employee: data.employee
            })
          )
        } else {
          journalData.append(
            'data',
            JSON.stringify({
              invoice: selectedInvoice?.id,
              quotation: selectedQuotation?.id,
              amount: paidAmount,
              credit_account: data.account_header,
              debit_account: accountId,
              created_user: userId,
              company: companyId,
              client: data.client != 0 ? data.client : null
            })
          )
        }
        await postDataToApiAxios('/journals', journalData)

        toast.success('Transaction added successfully')
      }

      router.push('/apps/accounts/transaction')
    } catch (error: any) {
      toast.error('Error adding Transaction')
      console.error('Error adding Transaction:', error.message)
    }
  }

  return (
    <Card>
      <CardHeader title={id ? 'Edit Transaction' : 'Add Transaction'} />
      <Divider sx={{ m: '0 !important' }} />
      <form onSubmit={handleSubmit(onSubmit)} onReset={reset as FormEventHandler<HTMLFormElement>}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt='Logo Preview'
                    style={{ width: '100px', height: '100px', marginRight: '20px' }}
                  />
                )}
                <div>
                  <Button component='label' variant='contained' htmlFor='logo-upload-button'>
                    Upload Image
                    <input
                      hidden
                      type='file'
                      accept='image/png, image/jpeg'
                      onChange={handleInputImageChange}
                      id='logo-upload-button'
                    />
                  </Button>
                  <Button
                    sx={{ marginLeft: '10px' }}
                    color='secondary'
                    variant='outlined'
                    onClick={handleInputImageReset}
                  >
                    Reset
                  </Button>
                  <Typography sx={{ mt: 5, color: 'text.disabled' }}>Allowed PNG or JPEG. Max size of 800K.</Typography>
                </div>
              </Box>
              {errors.image && <span>{errors.image.message}</span>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.account_header}>
                <InputLabel id='account_header'>Account Head</InputLabel>
                <Controller
                  name='account_header'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label='Account Head'
                      labelId='account_header'
                      onChange={e => {
                        setAccountHeadId(e.target.value)
                        field.onChange(e)
                      }}
                    >
                      {accountHeaders
                        .filter(accountHeader => !['ca', 'ba', 'ma'].includes(accountHeader?.attributes?.short_name))
                        .map(accountHeader => (
                          <MenuItem key={accountHeader.id} value={accountHeader.id}>
                            {accountHeader?.attributes?.name}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
                <FormHelperText>{errors.account_header?.message}</FormHelperText>
              </FormControl>
            </Grid>

            {accountId === 1 && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.client}>
                    <InputLabel id='client'>Client</InputLabel>
                    <Controller
                      name='client'
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label='Client'
                          labelId='client'
                          onChange={e => {
                            setSelectedClientId(e.target.value)
                            field.onChange(e)
                          }}
                        >
                          {companies.map(company => (
                            <MenuItem key={company.id} value={company.id}>
                              {company?.attributes?.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    <FormHelperText>{errors.client?.message}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.client}>
                    <Autocomplete
                      disablePortal
                      id='invoice-auto'
                      options={invoices}
                      getOptionLabel={option => option.invoice_no}
                      onChange={(event, newValue) => {
                        setSelectedInvoice(newValue)
                      }}
                      renderOption={(props, option) => (
                        <li {...props}>
                          {`Inv No. ${option.invoice_no} - ${option.subject} - Total- ${
                            option.total_amount
                          } - ${new Date(option.date).toLocaleDateString()}`}
                        </li>
                      )}
                      renderInput={params => <TextField {...params} label='Invoice No.' />}
                    />

                    <FormHelperText>{errors.client?.message}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label='Total Amount'
                    type='number'
                    name='total_amount'
                    value={totalAmount}
                    InputProps={{
                      readOnly: true
                    }}
                    variant='outlined'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label='Paid Amount'
                    type='number'
                    name='paid_amount'
                    value={paidAmount}
                    onChange={e => {
                      handlePaidAmountChange(e)
                    }}
                    variant='outlined'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label='Due Amount'
                    type='number'
                    name='due_amount'
                    value={dueAmount}
                    InputProps={{
                      readOnly: true
                    }}
                    variant='outlined'
                    fullWidth
                  />
                </Grid>
              </>
            )}

            {accountId === 2 && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.client}>
                    <InputLabel id='client'>Client</InputLabel>
                    <Controller
                      name='client'
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label='Client'
                          labelId='client'
                          onChange={e => {
                            setSelectedClientId(e.target.value)
                            field.onChange(e)
                          }}
                        >
                          {companies.map(company => (
                            <MenuItem key={company.id} value={company.id}>
                              {company?.attributes?.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    <FormHelperText>{errors.client?.message}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.client}>
                    <Autocomplete
                      disablePortal
                      id='invoice-auto'
                      options={quotation}
                      getOptionLabel={option => option.quotation_no}
                      onChange={(event, newValue) => {
                        setSelectedQuotation(newValue)
                      }}
                      renderOption={(props, option) => (
                        <li {...props}>
                          {`Quot No. ${option.quotation_no} - ${option.subject} - Total- ${
                            option.client_rate
                          } - ${new Date(option.date).toLocaleDateString()}`}
                        </li>
                      )}
                      renderInput={params => <TextField {...params} label='Quotation No.' />}
                    />

                    <FormHelperText>{errors.client?.message}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label='Total Amount'
                    type='number'
                    name='total_amount'
                    value={totalAmount}
                    InputProps={{
                      readOnly: true
                    }}
                    variant='outlined'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label='Paid Amount'
                    type='number'
                    name='paid_amount'
                    value={paidAmount}
                    onChange={e => {
                      handlePaidAmountChange(e)
                    }}
                    variant='outlined'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label='Due Amount'
                    type='number'
                    name='due_amount'
                    value={dueAmount}
                    InputProps={{
                      readOnly: true
                    }}
                    variant='outlined'
                    fullWidth
                  />
                </Grid>
              </>
            )}

            {accountId === 5 && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.employee}>
                    <InputLabel id='employee'>Employee</InputLabel>
                    <Controller
                      name='employee'
                      control={control}
                      render={({ field }) => (
                        <Select {...field} label='Employee' labelId='employee'>
                          {companyUser?.map((user: any) => (
                            <MenuItem key={user.id} value={user.id}>
                              {user?.username}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    <FormHelperText>{errors.client?.message}</FormHelperText>
                  </FormControl>
                </Grid>

                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    label='Total Amount'
                    type='number'
                    name='total_amount'
                    value={totalAmount}
                    variant='outlined'
                    fullWidth
                  />
                </Grid> */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label='Paid Amount'
                    type='number'
                    name='paid_amount'
                    value={paidAmount}
                    onChange={e => {
                      handlePaidAmountChange(e)
                    }}
                    variant='outlined'
                    fullWidth
                  />
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    label='Due Amount'
                    type='number'
                    name='due_amount'
                    value={dueAmount}
                    InputProps={{
                      readOnly: true
                    }}
                    variant='outlined'
                    fullWidth
                  />
                </Grid> */}
              </>
            )}

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.payment_option}>
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
                <FormHelperText>{errors.payment_option?.message}</FormHelperText>
              </FormControl>
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <Controller
                name='amount'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='number'
                    label='Amount'
                    placeholder='Amount'
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                  />
                )}
              />
            </Grid> */}

            <Grid item xs={12} sm={6}>
              <Controller
                name='notes'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    minRows={3}
                    label='notes'
                    placeholder='notes...'
                    error={!!errors.notes}
                    helperText={errors.notes?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='status'
                control={control}
                defaultValue={true} // Set the default value to true
                render={({ field }) => (
                  <FormControlLabel control={<Switch {...field} checked={field.value} />} label='Status' />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ m: '0 !important' }} />
        <CardActions>
          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
            {id ? 'Update' : 'Submit'}
          </Button>
          <Button type='reset' size='large' color='secondary' variant='outlined'>
            Reset
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default AddTransaction
