// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Imports
import toast from 'react-hot-toast'
import { ThemeColor } from 'src/@core/layouts/types'
import ConfirmDialog from 'src/pages/reuseableComponent/deleteDialouge'
import { deleteDataFromApi } from 'src/utils/api'
import router from 'next/router'

// ** Custom Component Imports

interface Props {
  contactPersonData: any
}

interface InvoiceStatusObj {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
}
interface CellType {
  row: any
}

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

// ** Vars
const invoiceStatusObj: InvoiceStatusObj = {
  Sent: { color: 'secondary', icon: 'mdi:send' },
  Paid: { color: 'success', icon: 'mdi:check' },
  Draft: { color: 'primary', icon: 'mdi:content-save-outline' },
  'Partial Payment': { color: 'warning', icon: 'mdi:chart-pie' },
  'Past Due': { color: 'error', icon: 'mdi:information-outline' },
  Downloaded: { color: 'info', icon: 'mdi:arrow-down' }
}

const ContactList = ({ contactPersonData }: Props) => {
  console.log('<=======contactPersonData=======>', contactPersonData)

  // ** State
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const [contacts, setContacts] = useState(contactPersonData)
  const [deleteId, setDeleteId] = useState<string | number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    setContacts(contactPersonData)
  }, [contactPersonData])

  const handleEdit = (id: string | number) => {
    // Find the contact type by id
    const selectedContact = contacts.find(item => item.id === id)
    if (selectedContact) {
      router.push(`/apps/company/contact-person/add?id=${selectedContact.id}`)
    }
  }

  const RowOptions = ({ id }: { id: number | string }) => {
    return (
      <>
        <Tooltip title='Edit' placement='top'>
          <IconButton size='small' onClick={() => handleEdit(id)}>
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
      flex: 0.25,
      minWidth: 90,
      field: 'name',
      headerName: 'Name',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.attributes.name || 0}</Typography>
    },
    {
      flex: 0.25,
      minWidth: 90,
      field: 'phone',
      headerName: 'Phone',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.attributes?.phone || 0}</Typography>
    },
    {
      flex: 0.25,
      minWidth: 90,
      field: 'position',
      headerName: 'Position',
      renderCell: ({ row }: CellType) => (
        <Typography variant='body2'>{row.attributes?.contact_type?.data?.attributes?.title || 0}</Typography>
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
        await deleteDataFromApi(`/contact-people/${deleteId}`)
        setContacts(contacts.filter(contact => contact.id !== deleteId))
        setDialogOpen(false)
        toast.success('Contact person deleted successfully')
      } catch (error) {
        console.error('Error deleting contact person:', error)
        toast.error('Failed to delete contact person')
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
    <>
      <Card>
        {/* <CardHeader title='Invoice List' sx={{ '& .MuiCardHeader-action': { m: 0 } }} /> */}
        <DataGrid
          autoHeight
          columns={columns}
          rows={contacts}
          disableRowSelectionOnClick
          pageSizeOptions={[7, 10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
        />
      </Card>
      <ConfirmDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this contact people?'
      />
    </>
  )
}

export default ContactList
