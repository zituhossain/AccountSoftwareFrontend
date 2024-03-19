import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Select, Switch } from '@mui/material'
import { useRouter } from 'next/navigation'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { BusinessRelationType, CompanyType, QuotationType } from 'src/types/apps/userTypes'
import { FormEventHandler, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { fetchDataFromApi, postDataToApi, storedToken } from 'src/utils/api'

const AddQuotation = () => {
  const router = useRouter()

  const [client, setClient] = useState<BusinessRelationType[]>([])
  const [userId, setUserId] = useState<number[]>([])
  const [companyId, setCompanyId] = useState<number[]>([])

  // const [contact, setContact] = useState<ContactPersonType[]>([])

  const schema = yup.object().shape({
    // type: yup.string().required('Type is required'),
    // name: yup.string().required('Name is required'),
    // email: yup.string().email('Invalid email format').required('Email is required')
  })

  const defaultValues: QuotationType = {
    quotation_no: '',
    subject: '',
    client_rate: 0,
    our_rate: 0,
    no_of_items: 0,
    overweight: 0,
    lc_number: '',
    bl_number: '',
    remarks: '',
    status: false,
    send_status: false,
    revision_count: 0
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<QuotationType>({
    resolver: yupResolver(schema),
    defaultValues
  })

  useEffect(() => {
    const fetchPositions = async () => {
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
    fetchPositions()
  }, [])

  useEffect(() => {
    const fetchCompanyContact = async () => {
      try {
        const response = await fetchDataFromApi('/b2b-relations')
        setClient(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchCompanyContact()
  }, [])

  const onSubmit = async (data: QuotationType) => {
    try {
      const formData = new FormData()
      formData.append('data', JSON.stringify(data))

      await postDataToApi('/quotations', formData)
      if (storedToken) {
        router.push('/apps/quotation/list')
        toast.success('Quotation added successfully')
      } else {
        toast.error('Something went wrong! Please try again.')
      }
    } catch (error: any) {
      console.error('Error adding quotations:', error.message)
    }
  }

  return (
    <Card>
      <CardHeader title='Add Quotation' />
      <Divider sx={{ m: '0 !important' }} />
      <form onSubmit={handleSubmit(onSubmit)} onReset={reset as FormEventHandler<HTMLFormElement>}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='quotation_no'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Quotation No'
                    placeholder='Quotation No'
                    error={!!errors.quotation_no}
                    helperText={errors.quotation_no?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='subject'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Subject'
                    placeholder='Subject'
                    error={!!errors.subject}
                    helperText={errors.subject?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='client_rate'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type='number'
                    fullWidth
                    label='Client Rate'
                    placeholder='Client Rate'
                    error={!!errors.client_rate}
                    helperText={errors.client_rate?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='our_rate'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type='number'
                    fullWidth
                    label='Our Rate'
                    placeholder='Our Rate'
                    error={!!errors.our_rate}
                    helperText={errors.our_rate?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='no_of_items'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type='number'
                    fullWidth
                    label='No of Items'
                    placeholder='No of Items'
                    error={!!errors.no_of_items}
                    helperText={errors.no_of_items?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='overweight'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type='number'
                    fullWidth
                    label='overweight'
                    placeholder='overweight'
                    error={!!errors.overweight}
                    helperText={errors.overweight?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='lc_number'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='LC Number'
                    placeholder=''
                    error={!!errors.lc_number}
                    helperText={errors.lc_number?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='bl_number'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Bill Number'
                    placeholder=''
                    error={!!errors.bl_number}
                    helperText={errors.bl_number?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='remarks'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Remarks'
                    placeholder=''
                    error={!!errors.remarks}
                    helperText={errors.remarks?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Client Contact</InputLabel>
                <Controller
                  name='client'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label='Client Contact'
                      labelId='form-layouts-separator-select-label'
                      error={!!errors?.client}
                    >
                      <MenuItem value={0}>Select Contact</MenuItem>
                      {client.map(cl => (
                        <MenuItem key={cl.id} value={cl.id}>
                          {cl?.id}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            {/* <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Company</InputLabel>
                <Controller
                  name='company'
                  control={control}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        label='Company'
                        labelId='form-layouts-separator-select-label'
                        error={!!errors.company}
                      >
                        <MenuItem value={0}>Select Company</MenuItem>
                        {company.map(com => (
                          <MenuItem key={com.id} value={com.id}>
                            {com?.attributes?.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.company && <FormHelperText error>{errors.company.message}</FormHelperText>}
                    </>
                  )}
                />
              </FormControl>
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='revision_count'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='number'
                    label='Revision Count'
                    placeholder='Revision Count'
                    error={!!errors.revision_count}
                    helperText={errors.revision_count?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Grid container spacing={5}>
                <Grid item xs={6} sm={6}>
                  <Controller
                    name='status'
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel control={<Switch {...field} defaultChecked />} label='Status' />
                    )}
                  />
                </Grid>
                <Grid item xs={6} sm={6}>
                  <Controller
                    name='send_status'
                    control={control}
                    render={({ field }) => <FormControlLabel control={<Switch {...field} />} label='Send Status' />}
                  />
                </Grid>
              </Grid>
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

export default AddQuotation
