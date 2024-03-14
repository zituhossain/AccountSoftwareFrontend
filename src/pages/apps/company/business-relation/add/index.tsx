// import { useState } from 'react'
import axios from 'axios'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { FormControlLabel, Switch } from '@mui/material'
import { useRouter } from 'next/navigation'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { BusinessRelationType } from 'src/types/apps/userTypes'

const AddB2bRelation = () => {
  const router = useRouter()

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required')
  })

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<BusinessRelationType>({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: BusinessRelationType) => {
    try {
      await axios.post('http://127.0.0.1:1337/api/b2b-relations', {
        data: data
      })
      console.log('B2b added successfully')
      router.push('/apps/company/business-relation')
    } catch (error: any) {
      console.error('Error adding business relation:', error.message)
    }
  }

  return (
    <Card>
      <CardHeader title='Add Business Relationship' />
      <Divider sx={{ m: '0 !important' }} />
      <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Business Contact</InputLabel>
                <Controller
                  name='attributes.business_contact_id'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label='Business Contact'
                      labelId='form-layouts-separator-select-label'
                      error={!!errors.attributes?.business_contact_id}
                    >
                      {/* <MenuItem value='supplier'>Supplier</MenuItem>
                      <MenuItem value='customer'>Customer</MenuItem> */}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Type</InputLabel>
                <Controller
                  name='attributes.relation_type'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label='Relation Type'
                      labelId='form-layouts-separator-select-label'
                      error={!!errors.attributes?.relation_type}
                    >
                      {/* <MenuItem value='supplier'>Supplier</MenuItem>
                      <MenuItem value='customer'>Customer</MenuItem> */}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='attributes.status'
                control={control}
                render={({ field }) => <FormControlLabel control={<Switch {...field} />} label='Status' />}
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Switch checked={Boolean(companyData.status)} onChange={handleSwitchChange} name='status' />}
                label='Status'
              />
            </Grid> */}
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

export default AddB2bRelation
