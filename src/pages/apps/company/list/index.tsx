// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports

// ** Custom Components Imports
import Link from 'next/link'
import CustomChip from 'src/@core/components/mui/chip'

// ** Third Party Components
import axios from 'axios'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Vars
const companyStatusObj: { [key: string]: ThemeColor } = {
  true: 'success',
  false: 'secondary'
}

interface CompanyType {
  id: number
  attributes: {
    type: string
    name: string
    address: string
    email: string
    code: string
    phone: string
    status: boolean
    createdAt: string
    updatedAt: string
    publishedAt: string
    avatar: string
    avatarColor?: ThemeColor
  }
}

interface CellType {
  row: CompanyType
}

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

const columns: GridColDef[] = [
  {
    flex: 0.2,
    minWidth: 230,
    field: 'name',
    headerName: 'Name',
    renderCell: ({ row }: CellType) => <LinkStyled href={`/companies/${row.id}`}>{row.attributes.name}</LinkStyled>
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: 'email',
    headerName: 'Email',
    renderCell: ({ row }: CellType) => (
      <Typography noWrap variant='body2'>
        {row.attributes.email}
      </Typography>
    )
  },
  {
    flex: 0.15,
    field: 'code',
    minWidth: 150,
    headerName: 'Code',
    renderCell: ({ row }: CellType) => (
      <Typography noWrap variant='body2'>
        {row.attributes.code}
      </Typography>
    )
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Type',
    field: 'type',
    renderCell: ({ row }: CellType) => (
      <Typography variant='subtitle1' noWrap>
        {row.attributes.type}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => (
      <CustomChip
        skin='light'
        size='small'
        label={row.attributes.status ? 'Active' : 'Inactive'}
        color={companyStatusObj[row.attributes.status]}
        sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
      />
    )
  }
]

const CompaniesList = () => {
  // ** State
  const [companies, setCompanies] = useState<CompanyType[]>([])

  useEffect(() => {
    // Fetch companies data from API
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/companies')
        console.log('zitu', response.data[0])
        setCompanies(response.data.data)
      } catch (error) {
        console.error('Error fetching companies:', error)
      }
    }
    fetchCompanies()
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Companies List' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <CardContent>
            <DataGrid
              autoHeight
              rows={companies}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CompaniesList
