// import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormControlLabel, MenuItem, Switch } from '@mui/material'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import { useRouter } from 'next/router'
import { FormEventHandler, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { B2BRelationType, BusinessRelationType, CompanyType } from 'src/types/apps/userTypes'
import { fetchDataFromApi, postDataToApiAxios, putDataToApi } from 'src/utils/api'
import * as yup from 'yup'

const AddB2bRelation = () => {
  const router = useRouter()
  const { id } = router.query

  const [userId, setUserId] = useState<number>(0)
  const [companyId, setCompanyId] = useState<number>(0)
  const [relationType, setRelationType] = useState<B2BRelationType[]>([])
  const [companies, setCompanies] = useState<CompanyType[]>([])

  const schema = yup.object().shape({})

  const defaultValues: BusinessRelationType = {
    status: true,
    company: 0,
    relation_type: 0,
    client: 0
  }

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors }
  } = useForm<BusinessRelationType>({
    resolver: yupResolver(schema),
    defaultValues
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

        if (id) {
          const response = await fetchDataFromApi(`/b2b-relations/${id}?populate=*`)
          const {
            data: { attributes }
          } = response

          setValue('client', attributes.client?.data?.id || 0)
          setValue('relation_type', attributes.relation_type?.data?.id || 0)
        }
      } catch (error) {
        console.error('Error fetching positions:', error)
      }
    }
    fetchRelationCompany()
  }, [id, setValue])

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await fetchDataFromApi(`/b2b-relations/${id}?populate=*`)
          const {
            data: { attributes }
          } = response

          console.log('attributes', attributes)

          // Set the form values using reset
          reset({
            ...attributes,
            status: attributes.status || false
          })
        } catch (error: any) {
          console.error('Error fetching b2b data:', error.message)
        }
      }
    }

    fetchData()
  }, [id, reset])

  const onSubmit = async (data: BusinessRelationType) => {
    data.created_user = userId
    data.company = companyId

    try {
      const formData = new FormData()
      formData.append('data', JSON.stringify(data))

      if (id) {
        await putDataToApi(`/b2b-relations/${id}`, formData)
        toast.success('B2b added updated successfully')
      } else {
        await postDataToApiAxios('/b2b-relations', formData)
        toast.success('B2b added added successfully')
      }
      router.push('/apps/company/business-relation')
    } catch (error) {
      toast.error('Something went wrong! Please try again.')
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
                render={({ field }) => (
                  <FormControlLabel control={<Switch {...field} />} checked={field.value} label='Status' />
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

export default AddB2bRelation
