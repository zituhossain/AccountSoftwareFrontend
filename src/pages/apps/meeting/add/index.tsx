import React, { forwardRef, useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import * as yup from 'yup'
import { fetchDataFromApi, postDataToApiAxios, putDataToApi } from 'src/utils/api'
import { formatISO } from 'date-fns'

// Yup validation schema
const schema = yup.object().shape({
  title: yup.string().required('Meeting title is required'),
  date: yup.date().required('Meeting date is required').nullable(),
  description: yup.string(),
  meeting_users: yup.array().min(1, 'At least one user is required')
})

const CustomDatePickerInput = forwardRef((props, ref) => {
  return <TextField {...props} inputRef={ref} />
})

const AddMeeting = () => {
  const router = useRouter()
  const { id } = router.query

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      date: new Date(),
      meeting_link: '',
      description: '',
      meeting_users: []
    }
  })

  const [userId, setUserId] = useState<number>(0)
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetchDataFromApi('/users?populate=*')
      console.log('zuuuuu', response)

      setUsers(response)
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData')!)
        setUserId(userData.id)
        const userResponse = await fetchDataFromApi(`/users/${userData.id}?populate=company`)
        console.log('userResponse', userResponse)

        if (id) {
          const response = await fetchDataFromApi(`/meetings/${id}?populate=*`)
          const {
            data: { attributes }
          } = response

          reset({
            title: attributes.title,
            date: attributes.date ? new Date(attributes.date) : new Date(),
            meeting_link: attributes.meeting_link,
            description: attributes.description
          })
        }
      } catch (error) {
        console.error('Error fetching meeting data:', error)
        toast.error('Failed to fetch meeting data')
      }
    }

    fetchMeeting()
  }, [id, reset])

  const onSubmit = async (data: any) => {
    data.created_user = userId

    const formattedData = {
      ...data,
      date: data.date ? formatISO(data.date) : null // Format date or send null if not provided
    }

    const formData = new FormData()
    formData.append('data', JSON.stringify(formattedData))

    try {
      if (id) {
        await putDataToApi(`/meetings/${id}`, formData)
        toast.success('Meeting updated successfully')
      } else {
        await postDataToApiAxios('/meetings', formData)
        toast.success('Meeting added successfully')
      }
      router.push('/apps/meeting')
    } catch (error) {
      toast.error('Something went wrong! Please try again.')
    }
  }

  return (
    <Card>
      <CardHeader title={id ? 'Edit Meeting' : 'Add Meeting'} />
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='title'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Meeting Title'
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePickerWrapper>
                {/* <Typography variant='subtitle1' gutterBottom>
                  Meeting Time
                </Typography> */}
                <Controller
                  name='date'
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={date => field.onChange(date)}
                      showTimeSelect
                      timeFormat='h:mm aa'
                      timeIntervals={30}
                      timeCaption='Time'
                      dateFormat='MMMM d, yyyy h:mm aa'
                      customInput={<CustomDatePickerInput />}
                    />
                  )}
                />
              </DatePickerWrapper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='meeting_link'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Meeting Link'
                    error={!!errors.meeting_link}
                    helperText={errors.meeting_link?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='demo-multiple-name-label'>Meeting Users</InputLabel>
                <Controller
                  name='meeting_users'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      multiple
                      labelId='demo-multiple-name-label'
                      label='Meeting Users'
                      renderValue={selected =>
                        users
                          .filter(user => selected.includes(user.id))
                          .map(user => user.username)
                          .join(', ')
                      }
                    >
                      {users.map(user => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.username}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Description'
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button type='submit' variant='contained' color='primary'>
            {id ? 'Update' : 'Submit'}
          </Button>
          <Button type='reset' onClick={() => reset()} variant='outlined' color='secondary'>
            Reset
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default AddMeeting
