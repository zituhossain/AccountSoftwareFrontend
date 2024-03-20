import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { FormControlLabel, FormHelperText, MenuItem, Switch, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CompanyType, ContactPersonType, ContactType } from 'src/types/apps/userTypes'
import { FormEventHandler, useEffect, useState } from 'react'
import { fetchDataFromApi, postDataToApi, storedToken } from 'src/utils/api'
import toast from 'react-hot-toast'
import { Box } from '@mui/system'

const AddContact = () => {
  const router = useRouter()

  const [contactImg, setContactImg] = useState<File | null>(null)
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [company, setCompany] = useState<CompanyType[]>([])
  const [contactType, setContactType] = useState<ContactType[]>([])
  const [userId, setUserId] = useState<number>(0)

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email format'),
    phone: yup.string().required('Phone is required')
  })

  const defaultValues: ContactPersonType = {
    name: '',
    address: '',
    email: '',
    code: '',
    phone: '',
    status: true
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<ContactPersonType>({
    resolver: yupResolver(schema),
    defaultValues
  })

  const handleInputImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const selectedFile = e.target.files[0]
      setContactImg(selectedFile)
      setImgSrc(URL.createObjectURL(selectedFile))
    }
  }

  const handleInputImageReset = () => {
    setContactImg(null)
    setImgSrc(null)
  }

  useEffect(() => {
    const fetchCompany_Type = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData')!)
        setUserId(userData.id)
        const userResponse = await fetchDataFromApi(`/users/${userData.id}?populate=company`)

        const companyResponse = await fetchDataFromApi(`/companies?filters[id][$ne]=${userResponse.company.id}`)
        const response1 = await fetchDataFromApi('/contact-types')
        console.log('first', response1.data)
        setCompany(companyResponse.data)
        setContactType(response1.data)
      } catch (error) {
        console.error('Error fetching positions:', error)
      }
    }
    fetchCompany_Type()
  }, [])

  const onSubmit = async (data: ContactPersonType) => {
    data.created_user = userId
    try {
      const formData = new FormData()
      formData.append('data', JSON.stringify(data))
      if (contactImg) {
        formData.append('files.image', contactImg)
      }
      if (storedToken) {
        await postDataToApi('/contact-people', formData)
        router.push('/apps/company/contact-person')
        toast.success('Contact Person added successfully')
      } else {
        toast.error('Something went wrong! Please try again.')
      }
    } catch (error: any) {
      console.error('Error adding contact data:', error.message)
    }
  }

  return (
    <Card>
      <CardHeader title='Add Contact Person' />
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Contact Person Type</InputLabel>
                <Controller
                  name='contact_type'
                  control={control}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        label='Contact Person Type'
                        labelId='form-layouts-separator-select-label'
                        error={!!errors.contact_type}
                      >
                        <MenuItem value={0}>Select Type</MenuItem>
                        {contactType.map(type => (
                          <MenuItem key={type.id} value={type.id}>
                            {type?.attributes?.title}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.contact_type && <FormHelperText error>{errors.contact_type.message}</FormHelperText>}
                    </>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Name'
                    placeholder='Name'
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

export default AddContact
