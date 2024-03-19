import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { AppDispatch, RootState } from 'src/store'
import { UserPositionType } from 'src/types/apps/userTypes'
import { fetchDataFromApi, storedToken } from 'src/utils/api'
import * as yup from 'yup'
import authConfig from 'src/configs/auth'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
}

interface UserData {
  username: string
  email: string
  password: string
  confirmed: boolean
  image: string
  signature: string
  organizational_position: number
  company: number
  role: number
}

const Header = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '20px',
  justifyContent: 'space-between',
  backgroundColor: 'background.default'
}) as React.ComponentType<any>

const schema = yup.object().shape({
  username: yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmed: yup.boolean().required('Confirmation is required')
})

const AddUserDrawer = ({ open, toggle }: SidebarAddUserType) => {
  const [plan, setPlan] = useState<string>('basic')
  const [role, setRole] = useState<string>('subscriber')
  const [position, setPosition] = useState<UserPositionType[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.user)
  const [profile, setProfile] = useState<File | null>(null)
  const [profileImgSrc, setProfileImgSrc] = useState<string | null>(null)
  const [signature, setSignature] = useState<File | null>(null)
  const [signatureImgSrc, setSignatureImgSrc] = useState<string | null>(null)
  const [companyId, setCompanyId] = useState<any>(null)

  const router = useRouter()

  console.log('companyId', companyId)

  const handleInputProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const selectedFile = e.target.files[0]
      setProfile(selectedFile)
      setProfileImgSrc(URL.createObjectURL(selectedFile))
    }
  }

  const handleInputProfileImageReset = () => {
    setProfile(null)
    setProfileImgSrc(null)
  }

  const handleInputSignatureImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const selectedFile = e.target.files[0]
      setSignature(selectedFile)
      setSignatureImgSrc(URL.createObjectURL(selectedFile))
    }
  }

  const handleInputSignatureImageReset = () => {
    setSignature(null)
    setSignatureImgSrc(null)
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<UserData>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmed: false,
      image: '',
      signature: '',
      organizational_position: 0,
      role: 1,
      company: 0
    }
  })

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem(authConfig.storageUserKeyName)!)
        const userResponse = await fetchDataFromApi(`/users/${userData.id}?populate=company`)
        if (userResponse.company) {
          setCompanyId(userResponse.company.id)
        }
        const response = await fetchDataFromApi('/organizational-positions')
        console.log('response', response.data)
        setPosition(response.data)
      } catch (error) {
        console.error('Error fetching positions:', error)
      }
    }
    fetchPositions()
  }, [])

  const onSubmit = async (data: UserData) => {
    try {
      const formData: any = {}
      formData['username'] = data.username
      formData['email'] = data.email
      formData['password'] = data.password
      formData['confirmed'] = data.confirmed
      formData['image'] = profile
      formData['signature'] = signature
      formData['organizational_position'] = data.organizational_position
      formData['role'] = data.role
      formData['company'] = companyId

      console.log('formData', formData)

      const response = await axios.post('http://localhost:1337/api/users', formData, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response.status === 201) {
        router.push('/apps/user/list')
        toggle() // Close the modal after successful submission
        toast.success('User added successfully')
      } else {
        toast.error('Failed to add user. Please try again.')
      }
    } catch (error: any) {
      console.error('Error adding user:', error.message)
    }
  }

  const handleClose = () => {
    setPlan('basic')
    setRole('subscriber')
    toggle()
    reset()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>Add User</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='username'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField value={value} label='Username' onChange={onChange} error={Boolean(errors.username)} />
              )}
            />
            {errors.username && <FormHelperText sx={{ color: 'error.main' }}>{errors.username.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='email'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField type='email' value={value} label='Email' onChange={onChange} error={Boolean(errors.email)} />
              )}
            />
            {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='password'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type='password'
                  value={value}
                  label='Password'
                  onChange={onChange}
                  error={Boolean(errors.password)}
                />
              )}
            />
            {errors.password && <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id='position-select'>Select Position</InputLabel>
            <Controller
              name='organizational_position' // Name of the field in your form data
              control={control} // Pass the control from react-hook-form
              render={({ field }) => (
                <Select
                  {...field} // Spread the field props into the Select component
                  fullWidth
                  label='Select Position'
                  labelId='position-select'
                >
                  <MenuItem value={0}>Select Position</MenuItem>
                  {position.map(pos => (
                    <MenuItem key={pos.id} value={pos.id}>
                      {pos.attributes?.title}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {profileImgSrc && (
                <img
                  src={profileImgSrc}
                  alt='Profile Preview'
                  style={{ width: '100px', height: '100px', marginRight: '20px' }}
                />
              )}
              <div>
                <Button
                  sx={{ marginTop: '10px' }}
                  component='label'
                  variant='contained'
                  htmlFor='profile-upload-button'
                >
                  Upload Profile
                  <input
                    hidden
                    type='file'
                    accept='image/png, image/jpeg'
                    onChange={handleInputProfileImageChange}
                    id='profile-upload-button'
                  />
                </Button>
                <Button
                  sx={{ marginLeft: '10px', marginTop: '10px' }}
                  color='secondary'
                  variant='outlined'
                  onClick={handleInputProfileImageReset}
                >
                  Reset
                </Button>
                <Typography sx={{ mt: 5, color: 'text.disabled' }}>Allowed PNG or JPEG. Max size of 800K.</Typography>
              </div>
            </Box>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {signatureImgSrc && (
                <img
                  src={signatureImgSrc}
                  alt='Signature Preview'
                  style={{ width: '100px', height: '100px', marginRight: '20px' }}
                />
              )}
              <div>
                <Button
                  sx={{ marginTop: '10px' }}
                  component='label'
                  variant='contained'
                  htmlFor='signature-upload-button'
                >
                  Upload Signature
                  <input
                    hidden
                    type='file'
                    accept='image/png, image/jpeg'
                    onChange={handleInputSignatureImageChange}
                    id='signature-upload-button'
                  />
                </Button>
                <Button
                  sx={{ marginLeft: '10px', marginTop: '10px' }}
                  color='secondary'
                  variant='outlined'
                  onClick={handleInputSignatureImageReset}
                >
                  Reset
                </Button>
                <Typography sx={{ mt: 5, color: 'text.disabled' }}>Allowed PNG or JPEG. Max size of 800K.</Typography>
              </div>
            </Box>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Typography variant='body1'>Confirmed</Typography>
            <Controller
              name='confirmed'
              control={control}
              render={({ field }) => <Switch {...field} color='primary' />}
            />
            {errors.confirmed && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.confirmed.message}</FormHelperText>
            )}
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
              Submit
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default AddUserDrawer
