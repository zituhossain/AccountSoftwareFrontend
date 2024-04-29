import { yupResolver } from '@hookform/resolvers/yup'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  TextField
} from '@mui/material'
import { useRouter } from 'next/router'
import { FormEventHandler, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ContactType } from 'src/types/apps/allTypes'
import { fetchDataFromApi, postDataToApiAxios, putDataToApi } from 'src/utils/api'
import * as yup from 'yup'

const AddContactType = () => {
  const router = useRouter()
  const { id } = router.query

  const schema = yup.object().shape({
    title: yup.string().required('Title is required')
  })

  const defaultValues = { title: '', status: true }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }

    // setValue
  } = useForm<ContactType>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const response = await fetchDataFromApi(`/contact-types/${id}`)
          const {
            data: { attributes }
          } = response
          reset(attributes)
        }
      } catch (error: any) {
        console.error('Error fetching contact type:', error.message)
      }
    }

    fetchData()
  }, [id, reset])

  const onSubmit = async (data: ContactType) => {
    const formData = new FormData()
    formData.append('data', JSON.stringify(data))
    try {
      if (id) {
        await putDataToApi(`/contact-types/${id}`, formData)
        toast.success('Contact type updated successfully')
      } else {
        await postDataToApiAxios('/contact-types', formData)
        toast.success('Contact type added successfully')
      }
      router.push('/apps/company/contact-type')
    } catch (error) {
      toast.error('Something went wrong! Please try again.')
    }
  }

  return (
    <Card>
      <CardHeader title={id ? 'Edit Contact Type' : 'Add Contact Type'} />
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
                  <FormControlLabel control={<Switch {...field} checked={field.value} />} label='Status' />
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

export default AddContactType
