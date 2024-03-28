// import { useState } from 'react'
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
import { AccountHeadType } from 'src/types/apps/userTypes'
import { FormEventHandler } from 'react'
import { postDataToApi } from 'src/utils/api'

const AddAccountHead = () => {
  const router = useRouter()

  const schema = yup.object().shape({
    head_title: yup.string().required('Account Header is required')
  })

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<AccountHeadType>({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: AccountHeadType) => {
    console.log('firstsd', data)
    try {
      const formData = new FormData()
      formData.append('data', JSON.stringify(data))
      await postDataToApi('/account-headers', formData)
      console.log('account header added successfully')
      router.push('/apps/accounts/account-head')
    } catch (error: any) {
      console.error('Error adding account header:', error.message)
    }
  }

  return (
    <Card>
      <CardHeader title='Add Account Header' />
      <Divider sx={{ m: '0 !important' }} />
      <form onSubmit={handleSubmit(onSubmit)} onReset={reset as FormEventHandler<HTMLFormElement>}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='head_title'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Header Name'
                    placeholder='Header Name'
                    error={!!errors.head_title}
                    helperText={errors.head_title?.message}
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
                    label='description'
                    placeholder='description...'
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
                render={({ field }) => <FormControlLabel control={<Switch {...field} />} label='Status' />}
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

export default AddAccountHead
