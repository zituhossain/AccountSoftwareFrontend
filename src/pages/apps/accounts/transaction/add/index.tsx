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
  const [accountHeaders, setAccountHeaders] = useState<AccountHeadType[]>([])
  const [transactionImg, setTransactionImg] = useState<File | null>(null)
  const [imgSrc, setImgSrc] = useState<string | null>(null)

  const schema = yup.object().shape({
    account_headers: yup.string().required('Account Head is required'),
    amount: yup.number().required('Amount is required'),
    payment_option: yup.number().required('Payment Option is required')
  })

  const defaultValues: TransactionType = {
    account_headers: 0,
    amount: 0,
    payment_option: 0,
    client: 0,
    status: true,
    notes: '',
    created_user: userId,
    company: companyId
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
    const fetchRelationCompany = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData')!)
        const userResponse = await fetchDataFromApi(`/users/${userData.id}?populate=company`)

        if (userResponse) {
          setUserId(userResponse.id)
          if (userResponse.company) setCompanyId(userResponse.company.id)
        }

        const account_headers_response = await fetchDataFromApi('/account-headers')
        setAccountHeaders(account_headers_response.data)

        const company_response = await fetchDataFromApi(`/companies?filters[id][$ne]=${userResponse.company.id}`)
        setCompanies(company_response.data)

        if (id) {
          const response = await fetchDataFromApi(`/transactions/${id}?populate=*`)
          const {
            data: { attributes }
          } = response

          setValue('client', attributes.client?.data?.id || 0)
          setValue('account_headers', attributes.account_headers?.data?.id || 0)
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

  const onSubmit = async (data: TransactionType) => {
    console.log('firstsd', data)
    data.company = companyId
    data.created_user = userId
    try {
      const formData = new FormData()
      formData.append('data', JSON.stringify(data))

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
              <FormControl fullWidth error={!!errors.account_headers}>
                <InputLabel id='account_headers'>Account Head</InputLabel>
                <Controller
                  name='account_headers'
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label='Account Head' labelId='account_headers'>
                      {accountHeaders.map(accountHeader => (
                        <MenuItem key={accountHeader.id} value={accountHeader.id}>
                          {accountHeader?.attributes?.head_title}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>{errors.account_headers?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.client}>
                <InputLabel id='client'>Client</InputLabel>
                <Controller
                  name='client'
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label='Client' labelId='client'>
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
              <FormControl fullWidth error={!!errors.payment_option}>
                <InputLabel id='payment_option'>Payment Option</InputLabel>
                <Controller
                  name='payment_option'
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label='Payment Option' labelId='payment_option'>
                      <MenuItem value={0}>Cash</MenuItem>
                      <MenuItem value={1}>On Account</MenuItem>
                    </Select>
                  )}
                />
                <FormHelperText>{errors.payment_option?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
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
            </Grid>

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
