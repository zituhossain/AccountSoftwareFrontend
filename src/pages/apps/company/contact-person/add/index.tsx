import { yupResolver } from '@hookform/resolvers/yup'
import { FormControlLabel, FormHelperText, MenuItem, Switch, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import { FormEventHandler, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { CompanyType, ContactPersonType, ContactType } from 'src/types/apps/allTypes'
import { fetchDataFromApi, postDataToApiAxios, putDataToApi } from 'src/utils/api'
import { STRAPI_URL } from 'src/utils/urls'
import * as yup from 'yup'

const AddContact = () => {
  const router = useRouter()
  const { id } = router.query

  const [contactImg, setContactImg] = useState<File | null>(null)
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [company, setCompany] = useState<CompanyType[]>([])
  const [contactType, setContactType] = useState<ContactType[]>([])
  const [userId, setUserId] = useState<number>(0)

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email format'),
    phone: yup.string().required('Phone is required'),
    company: yup.number().positive('Company is required').required('Position is required')
  })

  const defaultValues: ContactPersonType = {
    name: '',
    address: '',
    email: '',
    code: '',
    phone: '',
    status: true,
    company: 0,
    contact_type: 0
  }

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    setError,
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
        const contactResponse = await fetchDataFromApi('/contact-types')
        console.log('first', contactResponse.data)
        setCompany(companyResponse.data)
        setContactType(contactResponse.data)

        if (id) {
          const response = await fetchDataFromApi(`/contact-people/${id}?populate=*`)
          const {
            data: { attributes }
          } = response

          setValue('company', attributes.company?.data?.id || 0)
          setValue('contact_type', attributes.contact_type?.data?.id || 0)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchCompany_Type()
  }, [id, setValue])

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await fetchDataFromApi(`/contact-people/${id}?populate=*`)
          const {
            data: { attributes }
          } = response

          // Set the form values using reset
          reset({
            ...attributes,
            status: attributes.status || false,
            image: attributes.image?.data?.id
          })

          // If there's an existing image, set it for preview
          if (attributes.image?.data?.attributes?.url) {
            setImgSrc(`${STRAPI_URL}${attributes?.image?.data?.attributes?.url}`)
          }
        } catch (error: any) {
          console.error('Error fetching contact data:', error.message)
        }
      }
    }

    fetchData()
  }, [id, reset])

  const onSubmit = async (data: ContactPersonType) => {
    data.created_user = userId

    try {
      const formData = new FormData()
      formData.append('data', JSON.stringify(data))
      if (contactImg) {
        formData.append('files.image', contactImg)
      }

      if (id) {
        // Update existing contact
        await putDataToApi(`/contact-people/${id}`, formData)
        toast.success('Contact Person updated successfully')
      } else {
        // Add new Contact Person
        await postDataToApiAxios('/contact-people', formData)
        toast.success('Contact Person added successfully')
      }
      router.push('/apps/company/contact-person')
    } catch (error: any) {
      console.error('Error submitting form:', error)
      if (error.response && error.response.data && error.response.data.error) {
        if (error.response.data.error.message === 'This attribute must be unique') {
          setError('email', { type: 'manual', message: 'Email already taken' })
        } else {
          toast.error(error.response.data.error.message)
        }
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    }
  }

  return (
    <Card>
      <CardHeader title={id ? 'Edit Contact Person' : 'Add Contact Person'} />
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
                        value={field.value}
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

export default AddContact
