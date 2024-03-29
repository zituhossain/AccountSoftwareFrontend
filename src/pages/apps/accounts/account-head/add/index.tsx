import { yupResolver } from '@hookform/resolvers/yup'
import { FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Select, Switch } from '@mui/material'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/navigation'
import { FormEventHandler } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { AccountHeadType } from 'src/types/apps/userTypes'
import { postDataToApiAxios } from 'src/utils/api'
import * as yup from 'yup'

const AddAccountHead = () => {
  const router = useRouter()

  const schema = yup.object().shape({
    head_title: yup.string().required('Account Header is required'),
    head_type: yup.string().required('Account Type is required')
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
      await postDataToApiAxios('/account-headers', formData)
      console.log('account header added successfully')
      toast.success('Account header added successfully')
      router.push('/apps/accounts/account-head')
    } catch (error: any) {
      toast.error('Error adding account header')
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
              <FormControl fullWidth error={!!errors.head_type}>
                <InputLabel id='head_type'>Header Type</InputLabel>
                <Controller
                  name='head_type'
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label='Header Type' labelId='head_type'>
                      <MenuItem value={0}>Credit</MenuItem>
                      <MenuItem value={1}>Debit</MenuItem>
                    </Select>
                  )}
                />
                <FormHelperText>{errors.head_type?.message}</FormHelperText>
              </FormControl>
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
                defaultValue={true} // Set the default value to true
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
