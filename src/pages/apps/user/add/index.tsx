import { yupResolver } from '@hookform/resolvers/yup'
import { Card, CardActions, CardContent, CardHeader, Divider, FormControlLabel, Grid } from '@mui/material'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/router'
import { FormEventHandler, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import authConfig from 'src/configs/auth'
import { UserPositionType } from 'src/types/apps/userTypes'
import { fetchDataFromApi, postDataToApiAxios, putDataToApi } from 'src/utils/api'
import * as yup from 'yup'

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

const schema = yup.object().shape({
  username: yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmed: yup.boolean().required('Confirmation is required')
})

const AddUser = () => {
  const [position, setPosition] = useState<UserPositionType[]>([])

  const [companyId, setCompanyId] = useState<any>(null)
  const [userId, setUserId] = useState<any>(null)

  const router = useRouter()
  const { id } = router.query

  const {
    reset,
    control,
    setValue,
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

        if (id) {
          const response = await fetchDataFromApi(`/users/${id}?populate=*`)
          setValue('organizational_position', response?.organizational_position?.id || 0)
        }
      } catch (error) {
        console.error('Error fetching positions:', error)
      }
    }
    fetchPositions()
  }, [id, setValue])

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await fetchDataFromApi(`/users/${id}?populate=*`)
          console.log('response--', response)

          reset({
            ...response,
            role: 1
          })
        } catch (error: any) {
          console.error('Error fetching user data:', error.message)
        }
      }
    }

    fetchData()
  }, [id, reset])

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
      if (id) {
        await putDataToApi(`/users/${id}`, formData)
        toast.success('User updated successfully')
      } else {
        await postDataToApiAxios('/users', formData)
        toast.success('User added successfully')
      }
      router.push('/apps/user/list')
    } catch (error) {
      toast.error('Something went wrong! Please try again.')
    }
  }

  return (
    <Card>
      <CardHeader title={id ? 'Edit User' : 'Add User'} />
      <Divider sx={{ m: '0 !important' }} />
      <form onSubmit={handleSubmit(onSubmit)} onReset={reset as FormEventHandler<HTMLFormElement>}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='username'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Username'
                    placeholder='Username'
                    error={!!errors.username}
                    helperText={errors.username?.message}
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
                    type='email'
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
                name='password'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='password'
                    label='password'
                    placeholder='password'
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Organizational Position</InputLabel>
                <Controller
                  name='organizational_position'
                  control={control}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        label='Organizational Position'
                        labelId='form-layouts-separator-select-label'
                        error={!!errors.organizational_position}
                        value={field.value}
                      >
                        <MenuItem value={0}>Select Position</MenuItem>
                        {position.map(pos => (
                          <MenuItem key={pos.id} value={pos.id}>
                            {pos.attributes?.title}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.organizational_position && (
                        <FormHelperText error>{errors.organizational_position.message}</FormHelperText>
                      )}
                    </>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='confirmed'
                control={control}
                render={({ field }) => (
                  <FormControlLabel control={<Switch {...field} checked={field.value} />} label='Confirmed' />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ m: '0 !important' }} />
        <CardActions>
          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
            {id ? 'Update' : 'Submit'}
          </Button>
          <Button type='reset' size='large' color='secondary' variant='outlined'>
            Reset
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default AddUser
