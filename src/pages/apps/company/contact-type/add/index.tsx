import { useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { API_URL } from 'src/utils/urls'
import { storedToken } from 'src/utils/api'
import {
  Card,
  Grid,
  Button,
  Divider,
  TextField,
  CardHeader,
  CardContent,
  CardActions,
  FormControlLabel,
  Switch
} from '@mui/material'
import { ContactType } from 'src/types/apps/userTypes'

const AddContactType = () => {
  const router = useRouter()
  const { id } = router.query

  const schema = yup.object().shape({
    title: yup.string().required('Title is required')
  })

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors }
  } = useForm<ContactType>({
    resolver: yupResolver(schema),
    defaultValues: { title: '', status: true }
  })

  useEffect(() => {
    if (id) {
      axios
        .get(`${API_URL}/contact-types/${id}`)
        .then(response => {
          const { title, status } = response.data
          setValue('title', title)
          setValue('status', status)
        })
        .catch(error => {
          console.error('Error fetching contact type:', error.message)
        })
    }
  }, [id, setValue])

  const onSubmit = async (data: ContactType) => {
    try {
      if (id) {
        await axios.put(
          `${API_URL}/contact-types/${id}`,
          { data: data },
          { headers: { Authorization: `Bearer ${storedToken}` } }
        )
        console.log('Contact type updated successfully')
      } else {
        await axios.post(
          `${API_URL}/contact-types`,
          { data: data },
          { headers: { Authorization: `Bearer ${storedToken}` } }
        )
        console.log('Contact type added successfully')
      }
      router.push('/apps/company/contact-type')
    } catch (error) {
      console.error('Error saving contact type:', error.message)
    }
  }

  return (
    <Card>
      <CardHeader title={id ? 'Edit Contact Type' : 'Add Contact Type'} />
      <Divider sx={{ m: '0 !important' }} />
      <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='title'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Title'
                    placeholder='Title'
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='status'
                control={control}
                render={({ field }) => <FormControlLabel control={<Switch {...field} />} label='Status' />}
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

export default AddContactType
