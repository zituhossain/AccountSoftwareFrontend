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
import { FormControlLabel, MenuItem, Switch } from '@mui/material'
import { useRouter } from 'next/navigation'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { B2BRelationType, BusinessRelationType, CompanyType } from 'src/types/apps/userTypes'
import { FormEventHandler, useEffect, useState } from 'react'
import { API_URL } from 'src/utils/urls'
import { fetchDataFromApi, storedToken } from 'src/utils/api'

const AddB2bRelation = () => {
  const router = useRouter()

  const [userId, setUserId] = useState<number>(0)
  const [companyId, setCompanyId] = useState<number>(0)
  const [relationType, setRelationType] = useState<B2BRelationType[]>([])
  const [companies, setCompanies] = useState<CompanyType[]>([])

  const schema = yup.object().shape({})

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<BusinessRelationType>({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    const fetchRelationCompany = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData')!)
        const userResponse = await fetchDataFromApi(`/users/${userData.id}?populate=company`)

        if (userResponse) {
          setUserId(userResponse.id)
          if (userResponse.company) setCompanyId(userResponse.company.id)
        }

        const relation_response = await fetchDataFromApi('/b2b-relation-types')
        const company_response = await fetchDataFromApi(`/companies?filters[id][$ne]=${userResponse.company.id}`)

        setRelationType(relation_response.data)
        setCompanies(company_response.data)
      } catch (error) {
        console.error('Error fetching positions:', error)
      }
    }
    fetchRelationCompany()
  }, [])

  const onSubmit = async (data: BusinessRelationType) => {
    data.company = companyId
    data.created_user = userId
    try {
      await axios.post(
        `${API_URL}/b2b-relations`,
        {
          data: data
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        }
      )
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
      <form onSubmit={handleSubmit(onSubmit)} onReset={reset as FormEventHandler<HTMLFormElement>}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Business Contact</InputLabel>
                <Controller
                  name='client'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label='Business Contact'
                      labelId='form-layouts-separator-select-label'
                      error={!!errors?.client}
                    >
                      <MenuItem value={0}>Select Company</MenuItem>
                      {companies.map(company => (
                        <MenuItem key={company.id} value={company.id}>
                          {company?.attributes?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Type</InputLabel>
                <Controller
                  name='relation_type'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label='Relation Type'
                      labelId='form-layouts-separator-select-label'
                      error={!!errors?.relation_type}
                    >
                      <MenuItem value={0}>Select Type</MenuItem>
                      {relationType.map(relation => (
                        <MenuItem key={relation.id} value={relation.id}>
                          {relation.attributes?.title}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
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

export default AddB2bRelation
