import { useState } from 'react'
import axios from 'axios'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { FormControlLabel, Switch } from '@mui/material'

const AddCompany = () => {
  const [companyData, setCompanyData] = useState({
    type: '',
    name: '',
    email: '',
    phone: '',
    code: '',
    address: '',
    status: 0

    // logo: null
  })

  console.log('companyData', companyData)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setCompanyData({ ...companyData, [name]: value })
  }

  const handleSwitchChange = (e: any) => {
    const { name, checked } = e.target
    const statusValue = checked ? 1 : 0
    setCompanyData({ ...companyData, [name]: statusValue })
  }

  // const handleLogoChange = (e: any) => {
  //   setCompanyData({ ...companyData, logo: e.target.files[0] })
  // }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('type', companyData.type)
    formData.append('name', companyData.name)
    formData.append('email', companyData.email)
    formData.append('phone', companyData.phone)
    formData.append('code', companyData.code)
    formData.append('address', companyData.address)
    formData.append('status', String(companyData.status || 0))

    // formData.append('logo', companyData.logo || '')

    axios
      .post('http://127.0.0.1:1337/api/companies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(() => {
        console.log('Company added successfully')
      })
      .catch(error => {
        console.error('Error adding company:', error.message)
      })
  }

  const handleReset = () => {
    setCompanyData({
      type: '',
      name: '',
      email: '',
      phone: '',
      code: '',
      address: '',
      status: 0

      // logo: null
    })
  }

  return (
    <Card>
      <CardHeader title='Add Company' />
      <Divider sx={{ m: '0 !important' }} />
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Type</InputLabel>
                <Select
                  name='type'
                  value={companyData.type}
                  onChange={handleChange}
                  label='Type'
                  labelId='form-layouts-separator-select-label'
                >
                  <MenuItem value='supplier'>Supplier</MenuItem>
                  <MenuItem value='customer'>Customer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='name'
                value={companyData.name}
                onChange={handleChange}
                label='Name'
                placeholder='Company Name'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='email'
                value={companyData.email}
                onChange={handleChange}
                label='Email'
                placeholder='Email'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='phone'
                value={companyData.phone}
                onChange={handleChange}
                label='Phone No.'
                placeholder='+1-123-456-8790'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='code'
                value={companyData.code}
                onChange={handleChange}
                label='Code'
                placeholder='code'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                name='address'
                value={companyData.address}
                onChange={handleChange}
                label='Address'
                placeholder='Address...'
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <TextField fullWidth name='logo' type='file' onChange={handleLogoChange} label='Logo' />
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Switch checked={Boolean(companyData.status)} onChange={handleSwitchChange} name='status' />}
                label='Status'
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

export default AddCompany
