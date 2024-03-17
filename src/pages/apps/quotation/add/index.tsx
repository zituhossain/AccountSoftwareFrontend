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
import { Box, FormControl, FormControlLabel, InputLabel, Select, Switch, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { QuotationFromStrapi } from 'src/types/apps/userTypes'
import { FormEventHandler, useState } from 'react'
import toast from 'react-hot-toast'
import { postDataToApi, storedToken } from 'src/utils/api'

const AddQuotation = () => {
  const router = useRouter()

  const [quotationImages, setQuotationImages] = useState<File[]>([])
  const [imgSrcs, setImgSrcs] = useState<string[]>([])

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

  const handleInputImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const selectedFiles = Array.from(e.target.files)
      const newImages = [...quotationImages, ...selectedFiles]
      setQuotationImages(newImages)

      const newImgSrcs = selectedFiles.map(file => URL.createObjectURL(file))
      setImgSrcs([...imgSrcs, ...newImgSrcs])
    }
  }

  const handleInputImageReset = () => {
    setQuotationImages([])
    setImgSrcs([])
  }

  const onSubmit = async (data: QuotationFromStrapi) => {
    try {
      const formData = new FormData()
      formData.append('data', JSON.stringify(data))
      quotationImages.forEach((logo, index) => {
        formData.append(`files.quotationImages[${index}]`, logo)
      })

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

  // const onSubmit = async (data: QuotationFromStrapi) => {
  //   try {
  //     await axios.post(`${API_URL}/api/quotations`, {
  //       data: data
  //     })
  //     console.log('Quotation added successfully')
  //     router.push('/apps/quotation/list')
  //   } catch (error: any) {
  //     console.error('Error adding quotation:', error.message)
  //   }
  // }

  return (
    <Card>
      <CardHeader title='Add Quotation' />
      <Divider sx={{ m: '0 !important' }} />
      <form onSubmit={handleSubmit(onSubmit)} onReset={reset as FormEventHandler<HTMLFormElement>}>
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
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Business Contact</InputLabel>
                <Controller
                  name='business_contact_id'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label='Business Contact'
                      labelId='form-layouts-separator-select-label'
                      error={!!errors?.business_contact_id}
                    >
                      {/* <MenuItem value='supplier'>Supplier</MenuItem>
                      <MenuItem value='customer'>Customer</MenuItem> */}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={5}>
                <Grid item xs={6} sm={6}>
                  <Controller
                    name='status'
                    control={control}
                    render={({ field }) => <FormControlLabel control={<Switch {...field} />} label='Status' />}
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
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {imgSrcs.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Logo ${index + 1}`}
                    style={{ width: '100px', height: '100px', marginRight: '20px' }}
                  />
                ))}
                <div>
                  <Button component='label' variant='contained' htmlFor='logo-upload-button'>
                    Upload Logos
                    <input
                      hidden
                      type='file'
                      accept='image/png, image/jpeg'
                      multiple
                      onChange={handleInputImageChange}
                      id='logo-upload-button'
                    />
                  </Button>
                  <Button color='secondary' variant='outlined' onClick={handleInputImageReset}>
                    Reset
                  </Button>
                  <Typography sx={{ mt: 5, color: 'text.disabled' }}>Allowed PNG or JPEG. Max size of 800K.</Typography>
                </div>
              </Box>
              {errors.quotation_image && <span>{errors.quotation_image.message}</span>}
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
