// ** React Imports
import { useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import Link from 'next/link'
import CustomChip from 'src/@core/components/mui/chip'

// ** Third Party Components
// import axios from 'axios'

// ** Types Imports
import router from 'next/router'
import toast from 'react-hot-toast'
import { ThemeColor } from 'src/@core/layouts/types'
import ConfirmDialog from 'src/pages/reuseableComponent/deleteDialouge'
import { deleteDataFromApi, fetchDataFromApi } from 'src/utils/api'
import TableHeader from 'src/views/apps/company/list/TableHeader'

// ** Vars
const companyStatusObj: { [key: string]: ThemeColor } = {
  true: 'success',
  false: 'secondary'
}

interface CompanyType {
  id: number
  attributes: {
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

const CompaniesList = () => {
  // ** State
  const [companies, setCompanies] = useState<CompanyType[]>([])
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyType[]>([])
  const [value, setValue] = useState<string>('')

  const [deleteId, setDeleteId] = useState<string | number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const RowOptions = ({ id }: { id: number | string }) => {
    const handleEditClick = (id: string | number) => {
      handleEdit(id)
    }

    const handleView = () => {
      router.push(`/apps/company/view/${id}`)
    }

    return (
      <>
        <Tooltip title='View' placement='top'>
          <IconButton size='small' onClick={handleView}>
            <Icon icon='mdi:eye-outline' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Edit' placement='top'>
          <IconButton size='small' onClick={() => handleEditClick(id)}>
            <Icon icon='mdi:pencil-outline' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Delete' placement='top'>
          <IconButton size='small' onClick={() => handleDeleteClick(id)}>
            <Icon icon='mdi:delete-outline' />
          </IconButton>
        </Tooltip>
      </>
    )
  }
  const columns: GridColDef[] = [
    {
      sortable: true,
      field: 'slNo',
      headerName: '#',
      flex: 0,
      editable: false,
      renderCell: params => params.api.getAllRowIds().indexOf(params.id) + 1
    },
    {
      flex: 0.2,
      minWidth: 230,
      field: 'name',
      headerName: 'Company Name',
      renderCell: ({ row }: CellType) => <LinkStyled href={`#`}>{row.attributes.name}</LinkStyled>
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
      headerName: 'Phone',
      field: 'phone',
      renderCell: ({ row }: CellType) => (
        <Typography variant='subtitle1' noWrap>
          {row.attributes.phone}
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
          color={companyStatusObj[row.attributes.status.toString()]}
          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
        />
      )
    },
    {
      flex: 0.1,
      minWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => <RowOptions id={row.id} />
    }
  ]

  useEffect(() => {
    const filtered = companies.filter(company => company.attributes.name.toLowerCase().includes(value.toLowerCase()))
    setFilteredCompanies(filtered)
  }, [value, companies])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleEdit = (id: string | number) => {
    const selectedCompany = companies.find(item => item.id === id)
    console.log('selectedCompany', selectedCompany)
    if (selectedCompany) {
      router.push(`/apps/company/add?id=${selectedCompany.id}`)
    }
  }

  const handleDeleteConfirm = async () => {
    if (deleteId !== null) {
      try {
        await deleteDataFromApi(`/companies/${deleteId}`)
        setCompanies(companies.filter(item => item.id !== deleteId))
        setDialogOpen(false)
        toast.success('Contact type deleted successfully')
      } catch (error) {
        console.error('Error deleting contact type:', error)
        toast.error('Failed to delete contact type')
      }
    }
  }

  const handleDeleteClick = (id: string | number) => {
    setDeleteId(id)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  useEffect(() => {
    // Fetch companies data from API
    const fetchCompanies = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData')!)
        const userResponse = await fetchDataFromApi(`/users/${userData.id}?populate=company`)

        const companyResponse = await fetchDataFromApi(`/companies?filters[id][$ne]=${userResponse.company.id}`)

        setCompanies(companyResponse.data)
        setFilteredCompanies(companyResponse.data)
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
            <TableHeader value={value} handleFilter={handleFilter} selectedRows={[]} />
            <DataGrid
              autoHeight
              rows={filteredCompanies}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            />
          </CardContent>
        </Card>
      </Grid>
      <ConfirmDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this company?'
      />
    </Grid>
  )
}

export default CompaniesList
