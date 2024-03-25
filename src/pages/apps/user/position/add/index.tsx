import { yupResolver } from '@hookform/resolvers/yup'
import { Card, CardActions, CardContent, CardHeader, Divider, FormControlLabel, Grid } from '@mui/material'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/router'
import { FormEventHandler, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import authConfig from 'src/configs/auth'
import { fetchDataFromApi, postDataToApiAxios, putDataToApi } from 'src/utils/api'
import * as yup from 'yup'

interface PositionDataType {
  title: string
  description: string
  status: boolean
  company: any
}

const schema = yup.object().shape({
  title: yup.string().required('Title is required')
})

const AddPosition = () => {
  const [companyId, setCompanyId] = useState<any>(null)

  const router = useRouter()
  const { id } = router.query

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
      } catch (error) {
        console.error('Error fetching positions:', error)
      }
    }
    fetchPositions()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await fetchDataFromApi(`/organizational-positions/${id}?populate=*`)
          const {
            data: { attributes }
          } = response

          // Set the form values using reset
          reset({
            ...attributes,
            status: attributes.status || false
          })
        } catch (error: any) {
          console.error('Error fetching position data:', error.message)
        }
      }
    }

    fetchData()
  }, [id, reset])

  const onSubmit = async (data: PositionDataType) => {
    data.company = companyId

    const formData = new FormData()
    formData.append('data', JSON.stringify(data))
    try {
      if (id) {
        await putDataToApi(`/organizational-positions/${id}`, formData)
        toast.success('Positon updated successfully')
      } else {
        await postDataToApiAxios('/organizational-positions', formData)
        toast.success('Positon added successfully')
      }
      router.push('/apps/user/position')
    } catch (error) {
      toast.error('Something went wrong! Please try again.')
    }
  }

  return (
    <Card>
      <CardHeader title={id ? 'Edit Position' : 'Add Position'} />
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
                name='description'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    minRows={3}
                    label='Description'
                    placeholder='Description'
                    error={!!errors.description}
                    helperText={errors.description?.message}
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

export default AddPosition
