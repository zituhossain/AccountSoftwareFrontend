// ** React Imports
import { useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'

// import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import Link from 'next/link'
import CustomChip from 'src/@core/components/mui/chip'

// ** Third Party Components

// ** Types Imports
import router from 'next/router'
import { ThemeColor } from 'src/@core/layouts/types'
import { deleteDataFromApi, fetchDataFromApi } from 'src/utils/api'
import TableHeader from 'src/views/apps/company/contact-type/list/TableHeader'
import ConfirmDialog from 'src/pages/reuseableComponent/deleteDialouge'
import toast from 'react-hot-toast'

// ** Vars
const companyStatusObj: { [key: string]: ThemeColor } = {
  true: 'success',
  false: 'secondary'
}

interface ContactType {
  id: number
  attributes: {
    title: string
    status: boolean
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

interface CellType {
  row: ContactType
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

const ContactTypeList = () => {
  // ** State
  const [contact, setContact] = useState<ContactType[]>([])
  const [value, setValue] = useState<string>('')

  const [deleteId, setDeleteId] = useState<string | number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  useEffect(() => {
    // Fetch companies data from API
    const fetchContact = async () => {
      try {
        const response = await fetchDataFromApi('/contact-types')
        console.log('zitu', response.data)
        setContact(response.data)
      } catch (error) {
        console.error('Error fetching contact type:', error)
      }
    }
    fetchContact()
  }, [])

  const handleEdit = (id: string | number) => {
    // Find the contact type by id
    const selectedContact = contact.find(item => item.id === id)
    if (selectedContact) {
      router.push(`/apps/company/contact-type/add?id=${selectedContact.id}`)
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
      field: 'title',
      headerName: 'Title',
      renderCell: ({ row }: CellType) => <LinkStyled href={'#'}>{row.attributes.title}</LinkStyled>
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

  const handleDeleteConfirm = async () => {
    if (deleteId !== null) {
      try {
        await deleteDataFromApi(`/contact-types/${deleteId}`)
        setContact(contact.filter(item => item.id !== deleteId))
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
          <CardHeader title='Contact Type List' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <CardContent>
            <TableHeader value={value} handleFilter={handleFilter} selectedRows={[]} />
            <DataGrid
              autoHeight
              rows={contact}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
              onRowDoubleClick={params => handleEdit(params.row.id as number)}
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
//     const contactTypeData = await fetchDataFromApi('/api/contact-types')

//     console.log('mydata', contactTypeData.data)

//     return {
//       props: {
//         contactTypeData: contactTypeData.data
//       },
//       revalidate: 60 // Optional: This will re-generate the page every 60 seconds
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error)

//     return {
//       props: {
//         contactTypeData: []
//       }
//     }
//   }
// }

export default ContactTypeList
