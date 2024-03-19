import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
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
import { UserPositionType } from 'src/types/apps/userTypes'
import { fetchDataFromApi, storedToken } from 'src/utils/api'
import * as yup from 'yup'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
}

interface PositionDataType {
  title: string
  description: string
  status: boolean
}

const Header = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '20px',
  justifyContent: 'space-between',
  backgroundColor: 'background.default'
}) as React.ComponentType<any>

const schema = yup.object().shape({
  title: yup.string().required('Title is required')
})

const AddPositionDrawer = ({ open, toggle }: SidebarAddUserType) => {
  const [plan, setPlan] = useState<string>('basic')
  const [role, setRole] = useState<string>('subscriber')
  const [position, setPosition] = useState<UserPositionType[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.user)
  const [companyId, setCompanyId] = useState<any>(null)

  const router = useRouter()

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<PositionDataType>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      status: true
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
        setPosition(response.data)
      } catch (error) {
        console.error('Error fetching positions:', error)
      }
    }
    fetchPositions()
  }, [])

  const onSubmit = async (data: PositionDataType) => {
    try {
      const formData: any = {}
      formData['title'] = data.title
      formData['description'] = data.description
      formData['status'] = data.status

      console.log('formData', formData)

      const response = await axios.post(
        'http://localhost:1337/api/organizational-positions',
        { data: formData },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        }
      )
      if (response.status === 200) {
        router.push('/apps/user/position')
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
        <Typography variant='h6'>Add Position</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='title'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField value={value} label='Title' onChange={onChange} error={Boolean(errors.title)} />
              )}
            />
            {errors.title && <FormHelperText sx={{ color: 'error.main' }}>{errors.title.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  type='description'
                  value={value}
                  label='Description'
                  onChange={onChange}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Typography variant='body1'>Status</Typography>
            <Controller name='status' control={control} render={({ field }) => <Switch {...field} color='primary' />} />
            {errors.status && <FormHelperText sx={{ color: 'error.main' }}>{errors.status.message}</FormHelperText>}
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

export default AddPositionDrawer
