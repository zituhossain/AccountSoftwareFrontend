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
import authConfig from 'src/configs/auth'
import { AppDispatch, RootState } from 'src/store'
import { UserPositionType } from 'src/types/apps/allTypes'
import { fetchDataFromApi, postDataToApi, storedToken } from 'src/utils/api'
import * as yup from 'yup'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
}

interface UserData {
  username: string
  email: string
  password: string
  confirmed: boolean
  organizational_position: number
  company: number
  role: number
  created_user: number
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

  const [companyId, setCompanyId] = useState<any>(null)
  const [userId, setUserId] = useState<any>(null)

  const router = useRouter()

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
      organizational_position: 0,
      role: 1,
      company: 0,
      created_user: 0
    }
  })

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem(authConfig.storageUserKeyName)!)
        const userResponse = await fetchDataFromApi(`/users/${userData.id}?populate=company`)

        if (userResponse) {
          setUserId(userResponse.id)
          if (userResponse.company) setCompanyId(userResponse.company.id)
        }
        const response = await fetchDataFromApi('/organizational-positions')
        setPosition(response.data)
      } catch (error) {
        console.error('Error fetching positions:', error)
      }
    }
    fetchPositions()
  }, [])

  const onSubmit = async (data: UserData) => {
    try {
      const formData = new FormData()
      formData.append('username', data.username)
      formData.append('email', data.email)
      formData.append('password', data.password)
      formData.append('confirmed', data.confirmed.toString())
      formData.append('organizational_position', data.organizational_position.toString())
      formData.append('role', data.role.toString())
      formData.append('company', companyId)
      formData.append('created_user', userId)

      const response = await axios.post('http://localhost:1337/api/users', formData, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })

      // const response = await postDataToApi('/users', formData)

      if (response.status === 201) {
        router.reload()
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
