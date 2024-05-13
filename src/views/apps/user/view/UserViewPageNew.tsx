import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { Button, Card, CardContent, TextField, Grid, Avatar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import CardActions from '@mui/material/CardActions'
import { fetchDataFromApi, postDataToApiAxios, putDataToApi } from 'src/utils/api'
import { STRAPI_URL } from 'src/utils/urls'

// Validation Schema
const schema = yup
  .object({
    address: yup.string().required('Address is required'),
    phone: yup.string().required('Phone number is required')
  })
  .required()

const UserView = () => {
  const router = useRouter()
  const { id } = router.query
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          const response = await fetchDataFromApi(`/users/${id}?populate[user_profile][populate]=*`)
          console.log('zzzzzzzz', response)
          setUserData(response)

          if (response.user_profile && response.user_profile.profile.url) {
            const imageUrl = response.user_profile.profile.url
            setImgSrc(`${STRAPI_URL}${imageUrl}`)
          }

          setValue('address', response.user_profile?.address || '')
          setValue('phone', response.user_profile?.phone || '')
        } catch (error) {
          console.error('Error fetching user data:', error)
          toast.error('Failed to fetch user data.')
        }
      }
    }
    fetchUserData()
  }, [id, setValue])

  const handleInputImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setProfileImage(file)
      setImgSrc(URL.createObjectURL(file))
    }
  }

  const handleInputImageReset = () => {
    setProfileImage(null)
    setImgSrc(null)
  }

  const onSubmit = async (data: any) => {
    const formData = new FormData()

    // Append the user relationship in the JSON payload if creating a new profile
    const payload = {
      ...data,
      user: userData?.id
    }

    formData.append('data', JSON.stringify(payload))

    if (profileImage) {
      formData.append('files.profile', profileImage)
    }

    try {
      if (userData?.user_profile) {
        // Update existing profile
        await putDataToApi(`/user-profiles/${userData.user_profile.id}`, formData)
        toast.success('Profile updated successfully')
      } else {
        // Create new profile
        await postDataToApiAxios('/user-profiles', formData)
        toast.success('Profile created successfully')
      }
    } catch (error) {
      console.error('Error updating/creating user profile:', error)
      toast.error('Failed to update/create profile.')
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
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
              <Controller
                name='phone'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Phone No.'
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
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
          <CardActions>
            <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
              {userData?.user_profile ? 'Update Profile' : 'Create Profile'}
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  )
}

export default UserView
