// import { useState } from 'react'
import axios from 'axios'
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
import { ContactType } from 'src/types/apps/userTypes'
import { API_URL } from 'src/utils/urls'
import { FormEventHandler } from 'react'
import { storedToken } from 'src/utils/api'

const AddContactType = () => {
  const router = useRouter()

  const schema = yup.object().shape({
    title: yup.string().required('Title is required')
  })

  // Set initial form values
  const defaultValues: ContactType = {
    title: '',
    status: true
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<ContactType>({
    resolver: yupResolver(schema),
    defaultValues
  })

  const onSubmit = async (data: ContactType) => {
    try {
      await axios.post(
        `${API_URL}/contact-types`,
        {
          data: data
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        }
      )
      console.log('contact added successfully')
      router.push('/apps/company/contact-type')
    } catch (error: any) {
      console.error('Error adding contact type:', error.message)
    }
  }

  return (
    <Card>
      <CardHeader title='Add Contact Type' />
      <Divider sx={{ m: '0 !important' }} />
      <form onSubmit={handleSubmit(onSubmit)} onReset={reset as FormEventHandler<HTMLFormElement>}>
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

export default AddContactType
