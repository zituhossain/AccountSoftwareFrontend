// ** React Imports
import { useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import Link from 'next/link'
import CustomChip from 'src/@core/components/mui/chip'

// ** Third Party Components

// ** Types Imports
import router from 'next/router'
import toast from 'react-hot-toast'
import { ThemeColor } from 'src/@core/layouts/types'
import ConfirmDialog from 'src/pages/reuseableComponent/deleteDialouge'
import { deleteDataFromApi, fetchDataFromApi } from 'src/utils/api'
import TableHeader from 'src/views/apps/company/business-relation/TableHeader'

// ** Vars
const companyStatusObj: { [key: string]: ThemeColor } = {
  true: 'success',
  false: 'secondary'
}

interface BusinessRelation {
  id: number
  attributes: {
    company: {
      data: {
        attributes: {
          name: string
          code: string
          address: string
          email: string
          phone: string
          image: string
          createdAt: string
          updatedAt: string
          publishedAt: string
        }
      }
    }
    client: {
      data: {
        attributes: {
          name: string
          code: string
          address: string
          email: string
          phone: string
          image: string
          createdAt: string
          updatedAt: string
          publishedAt: string
        }
      }
    }
    relation_type: {
      data: {
        attributes: {
          title: string
          status: boolean
          createdAt: string
          updatedAt: string
          publishedAt: string
        }
      }
    }
    created_user: number
    status: boolean
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

interface CellType {
  row: BusinessRelation
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

const BusinessRelationList = () => {
  // ** State
  const [businessRelation, setBusinessRelation] = useState<BusinessRelation[]>([])
  const [value, setValue] = useState<string>('')

  const [deleteId, setDeleteId] = useState<string | number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  useEffect(() => {
    // Fetch companies data from API
    const fetchB2B = async () => {
      try {
        const response = await fetchDataFromApi('/b2b-relations?populate=*')
        console.log('zitu', response.data)
        setBusinessRelation(response.data)
      } catch (error) {
        console.error('Error fetching companies:', error)
      }
    }
    fetchB2B()
  }, [])

  const handleEdit = (id: string | number) => {
    const selectedB2B = businessRelation.find(item => item.id === id)
    if (selectedB2B) {
      router.push(`/apps/company/business-relation/add?id=${selectedB2B.id}`)
    }
  }

  const RowOptions = ({ id }: { id: number | string }) => {
    const handleEditClick = (id: string | number) => {
      handleEdit(id)
    }

    return (
      <>
        <MenuItem onClick={() => handleEditClick(id)} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(id)} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
        </MenuItem>
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
      field: 'client',
      headerName: 'Business Contact',
      renderCell: ({ row }: CellType) => (
        <LinkStyled href={`/companies/${row.id}`}>{row.attributes?.client?.data?.attributes?.name}</LinkStyled>
      )
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'relation_type',
      headerName: 'Type',
      renderCell: ({ row }: CellType) => (
        <Typography noWrap variant='body2'>
          {row.attributes?.relation_type?.data?.attributes?.title}
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
          label={row.attributes?.status ? 'Active' : 'Inactive'}
          color={companyStatusObj[row.attributes.status]}
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

  const handleDeleteConfirm = async () => {
    if (deleteId !== null) {
      try {
        await deleteDataFromApi(`/b2b-relations/${deleteId}`)
        setBusinessRelation(businessRelation.filter(item => item.id !== deleteId))
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

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Business Relation List'
            sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
          />
          <CardContent>
            <TableHeader value={value} handleFilter={handleFilter} selectedRows={[]} />
            <DataGrid
              autoHeight
              rows={businessRelation}
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
        message='Are you sure you want to delete this contact type?'
      />
    </Grid>
  )
}

// export const getStaticProps: GetStaticProps = async () => {
//   try {
//     const b2bRelationData = await fetchDataFromApi('/b2b-relations?populate=*')

//     console.log('mydata', b2bRelationData.data)

//     return {
//       props: {
//         b2bRelationData: b2bRelationData.data
//       },
//       revalidate: 60 // Optional: This will re-generate the page every 60 seconds
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error)

//     return {
//       props: {
//         b2bRelationData: []
//       }
//     }
//   }
// }

export default BusinessRelationList
