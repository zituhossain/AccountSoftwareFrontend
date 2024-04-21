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
import { useRouter } from 'next/router'
import { FormEventHandler, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { AccountHeadType } from 'src/types/apps/userTypes'
import { fetchDataFromApi, postDataToApiAxios, putDataToApi } from 'src/utils/api'
import { getFirstLetterLowerCase } from 'src/utils/shortName'
import * as yup from 'yup'

const AddAccountHead = () => {
  const router = useRouter()
  const { id } = router.query
  const [accounts, setAccounts] = useState<any[]>([])
  const [subAccounts, setSubAccounts] = useState<any[]>([])
  const [userId, setUserId] = useState<number | null>(null)
  const [companyId, setCompanyId] = useState<number | null>(null)
  const [subAccountDisabled, setSubAccountDisabled] = useState<any>(0)

  console.log('subAccountDisabled', subAccountDisabled)

  const schema = yup.object().shape({
    name: yup.string().required('Account Header name is required'),
    account: yup.string().required('Account Type is required')
  })

  const defaultValues = {
    name: '',
    description: '',
    status: true,
    account: '',
    short_name: ''
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<AccountHeadType>({
    resolver: yupResolver(schema),
    defaultValues
  })

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await fetchDataFromApi(`/individual-accounts/${id}?populate=*`)
          const {
            data: { attributes }
          } = response

          // Set the form values using reset
          reset({
            ...attributes,
            head_type: Number(attributes.head_type),
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
    const fetchAccount = async () => {
      try {
        const response = await fetchDataFromApi('/accounts')
        const responseSub = await fetchDataFromApi('/sub-accounts')
        const userData = JSON.parse(localStorage.getItem('userData')!)
        setUserId(userData.id)
        const userResponse = await fetchDataFromApi(`/users/${userData.id}?populate=company`)
        setCompanyId(userResponse?.company.id)

        setAccounts(response.data)
        setSubAccounts(responseSub.data)
      } catch (error) {
        console.error('Error fetching contact type:', error)
      }
    }
    fetchAccount()
  }, [])

  const onSubmit = async (data: AccountHeadType) => {
    try {
      data.short_name = getFirstLetterLowerCase(data.name)
      data.created_user = userId!
      data.company = companyId!
      const formData = new FormData()
      formData.append('data', JSON.stringify(data))

      if (id) {
        // Update existing contact
        await putDataToApi(`/individual-accounts/${id}`, formData)
        toast.success('Account Header updated successfully')
      } else {
        // Add new Account Header
        await postDataToApiAxios('/individual-accounts', formData)
        toast.success('Account Header added successfully')
      }
      router.push('/apps/accounts/account-head')
    } catch (error: any) {
      toast.error('Error adding account header')
      console.error('Error adding account header:', error.message)
    }
  }

  return (
    <Card>
      <CardHeader title={id ? 'Edit Account Header' : 'Add Account Header'} />
      <Divider sx={{ m: '0 !important' }} />
      <form onSubmit={handleSubmit(onSubmit)} onReset={reset as FormEventHandler<HTMLFormElement>}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Header Name'
                    placeholder='Header Name'
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.account}>
                <InputLabel id='account'>Account Type</InputLabel>
                <Controller
                  name='account'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label='Header Type'
                      labelId='account'
                      onChange={e => {
                        const accountId = e.target.value

                        // Enable or disable the sub_account field based on the selected account
                        setSubAccountDisabled(accountId)
                        field.onChange(e)
                      }}
                    >
                      <MenuItem value=''>Select Account</MenuItem>
                      {accounts.map(account => (
                        <MenuItem key={account.id} value={account.id}>
                          {account.attributes.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>{errors.account?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='sub_account'>Sub Account</InputLabel>
                <Controller
                  name='sub_account'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label='Header Type'
                      labelId='sub_account'
                      disabled={subAccountDisabled == 1 || subAccountDisabled == 2 ? false : true} // Set disabled prop dynamically
                    >
                      <MenuItem>Select Sub Account</MenuItem>
                      {subAccounts.map(sub_account => (
                        <MenuItem key={sub_account.id} value={sub_account.id}>
                          {sub_account.attributes.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    minRows={3}
                    label='description'
                    placeholder='description...'
                    error={!!errors.description}
                    helperText={errors.description?.message}
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

export default AddAccountHead
