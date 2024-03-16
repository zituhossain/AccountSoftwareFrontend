// import { useState } from 'react'
import axios from 'axios'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { FormControlLabel, Switch } from '@mui/material'
import { useRouter } from 'next/navigation'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { QuotationFromStrapi } from 'src/types/apps/userTypes'

const AddQuotation = () => {
  const router = useRouter()

  const schema = yup.object().shape({
    // type: yup.string().required('Type is required'),
    // name: yup.string().required('Name is required'),
    // email: yup.string().email('Invalid email format').required('Email is required')
  })

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<QuotationFromStrapi>({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: QuotationFromStrapi) => {
    try {
      await axios.post('http://127.0.0.1:1337/api/quotations', {
        data: data
      })
<<<<<<< HEAD
      console.log('Quotation added successfully')
      router.push('/apps/quotation/list')
    } catch (error: any) {
      console.error('Error adding quotation:', error.message)
=======
      console.log('quotations added successfully')
      router.push('/apps/quotation/list')
    } catch (error: any) {
      console.error('Error adding quotations:', error.message)
>>>>>>> login(auth-issue)
    }
  }

  return (
    <Card>
<<<<<<< HEAD
      <CardHeader title='Add Quotation' />
=======
      <CardHeader title='Add Quotations' />
>>>>>>> login(auth-issue)
      <Divider sx={{ m: '0 !important' }} />
      <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
        <CardContent>
          <Grid container spacing={5}>
            {/* <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Type</InputLabel>
                <Controller
                  name='type'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label='Type'
                      labelId='form-layouts-separator-select-label'
                      error={!!errors.type}
                      helperText={errors.type?.message}
                    >
                      <MenuItem value='supplier'>Supplier</MenuItem>
                      <MenuItem value='customer'>Customer</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid> */}
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
                name='supplier_rate'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type='number'
                    fullWidth
                    label='Supplier Rate'
                    placeholder='Supplier Rate'
                    error={!!errors.supplier_rate}
                    helperText={errors.supplier_rate?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='top4_rate'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type='number'
                    fullWidth
                    label='Top4 Rate Rate'
                    placeholder='Top4 Rate Rate'
                    error={!!errors.top4_rate}
                    helperText={errors.top4_rate?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='no_of_trailers'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type='number'
                    fullWidth
                    label='No of Trailers'
                    placeholder='No of Trailers'
                    error={!!errors.no_of_trailers}
                    helperText={errors.no_of_trailers?.message}
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
              <Controller
                name='status'
                control={control}
                render={({ field }) => <FormControlLabel control={<Switch {...field} />} label='Status' />}
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

export default AddQuotation
