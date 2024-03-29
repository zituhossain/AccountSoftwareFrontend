import { yupResolver } from '@hookform/resolvers/yup'
import { FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Select, Switch } from '@mui/material'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/navigation'
import { FormEventHandler, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { AccountHeadType, CompanyType, TransactionType } from 'src/types/apps/userTypes'
import { fetchDataFromApi, postDataToApiAxios } from 'src/utils/api'
import * as yup from 'yup'

const AddTransaction = () => {
  const router = useRouter()

  // State
  const [userId, setUserId] = useState<number>(0)
  const [companyId, setCompanyId] = useState<number>(0)
  const [companies, setCompanies] = useState<CompanyType[]>([])
  const [accountHeaders, setAccountHeaders] = useState<AccountHeadType[]>([])

  const schema = yup.object().shape({
    account_headers: yup.string().required('Account Head is required'),
    amount: yup.number().required('Amount is required'),
    payment_option: yup.number().required('Payment Option is required')
  })

  console.log(userId, companyId, companies)

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<TransactionType>({
    resolver: yupResolver(schema)
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
      } catch (error) {
        console.error('Error fetching positions:', error)
      }
    }
    fetchRelationCompany()
  }, [])

  const onSubmit = async (data: TransactionType) => {
    console.log('firstsd', data)
    data.company = companyId
    data.created_user = userId
    try {
      const formData = new FormData()
      formData.append('data', JSON.stringify(data))
      await postDataToApiAxios('/transactions', formData)
      console.log('Transaction added successfully')
      toast.success('Transaction added successfully')
      router.push('/apps/accounts/transaction')
    } catch (error: any) {
      toast.error('Error adding Transaction')
      console.error('Error adding Transaction:', error.message)
    }
  }

  return (
    <Card>
      <CardHeader title='Add Account Header' />
      <Divider sx={{ m: '0 !important' }} />
      <form onSubmit={handleSubmit(onSubmit)} onReset={reset as FormEventHandler<HTMLFormElement>}>
        <CardContent>
          <Grid container spacing={5}>
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
            Submit
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
