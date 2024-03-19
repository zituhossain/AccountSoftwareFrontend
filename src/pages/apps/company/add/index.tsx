import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
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
import { CompanyType } from 'src/types/apps/userTypes'
import { FormEventHandler } from 'react'
import { postDataToApi, storedToken } from 'src/utils/api'
import toast from 'react-hot-toast'

const AddCompany = () => {
  const router = useRouter()

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required')
  })

  const defaultValues: CompanyType = {
    name: '',
    status: true,
    address: '',
    email: '',
    code: '',
    phone: '',
    legal_information: '',
    website: ''
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<CompanyType>({
    resolver: yupResolver(schema),
    defaultValues
  })

  const [logo, setLogo] = useState<File | null>(null)
  const [imgSrc, setImgSrc] = useState<string | null>(null)

  const handleInputImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const selectedFile = e.target.files[0]
      setLogo(selectedFile)
      setImgSrc(URL.createObjectURL(selectedFile))
    }
  }

  const handleInputImageReset = () => {
    setLogo(null)
    setImgSrc(null)
  }

  const onSubmit = async (data: CompanyType) => {
    try {
      const formData = new FormData()
      formData.append('data', JSON.stringify(data))
      if (logo) {
        formData.append('files.logo', logo)
      }

      await postDataToApi('/companies', formData)
      if (storedToken) {
        router.push('/apps/company/list')
        toast.success('Company added successfully')
      } else {
        toast.error('Something went wrong! Please try again.')
      }
    } catch (error: any) {
      console.error('Error adding company:', error.message)
    }
  }

  return (
    <Card>
      <CardHeader title='Add Company' />
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
                    Upload Logo
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
              {errors.logo && <span>{errors.logo.message}</span>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Company Name'
                    placeholder='Company Name'
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Email'
                    placeholder='Email'
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='phone'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Phone No.'
                    placeholder='+1-123-456-8790'
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='code'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='code No.'
                    placeholder=''
                    error={!!errors.code}
                    helperText={errors.code?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='website'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Website'
                    placeholder='Website'
                    error={!!errors.website}
                    helperText={errors.website?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='legal_information'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Legal Information'
                    placeholder='Legal Information'
                    error={!!errors.legal_information}
                    helperText={errors.legal_information?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='address'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    minRows={3}
                    label='Address'
                    placeholder='Address...'
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='status'
                control={control}
                render={({ field }) => (
                  <FormControlLabel control={<Switch {...field} defaultChecked />} label='Status' />
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

export default AddCompany
