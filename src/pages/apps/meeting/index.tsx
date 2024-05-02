// ** React Imports
import { useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import Link from 'next/link'

// ** Third Party Components
import { formatDate } from 'src/utils/dateUtils'

// ** Types Imports
import Tooltip from '@mui/material/Tooltip'
import router from 'next/router'
import toast from 'react-hot-toast'
import { ThemeColor } from 'src/@core/layouts/types'
import ConfirmDialog from 'src/pages/reuseableComponent/deleteDialouge'
import { deleteDataFromApi, fetchDataFromApi } from 'src/utils/api'
import TableHeader from 'src/views/apps/meeting/list/TableHeader'

// ** Vars
const companyStatusObj: { [key: string]: ThemeColor } = {
  true: 'success',
  false: 'secondary'
}

interface Meeting {
  id: number
  attributes: {
    title: string
    meeting_link: string
    description: string
    created_user: number
    date: string
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

interface CellType {
  row: Meeting
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

const MeetingList = () => {
  // ** State
  const [contact, setContact] = useState<Meeting[]>([])
  const [filteredContact, setFilteredContact] = useState<Meeting[]>([])
  const [value, setValue] = useState<string>('')

  const [deleteId, setDeleteId] = useState<string | number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  useEffect(() => {
    const filtered = contact.filter(cont => cont.attributes.title.toLowerCase().includes(value.toLowerCase()))
    setFilteredContact(filtered)
  }, [value, contact])

  useEffect(() => {
    // Fetch companies data from API
    const fetchContact = async () => {
      try {
        const response = await fetchDataFromApi('/meetings?populate=*')
        console.log('contact', response.data)
        setContact(response.data)
        setFilteredContact(response.data)
      } catch (error) {
        console.error('Error fetching companies:', error)
      }
    }
    fetchContact()
  }, [])

  const handleEdit = (id: string | number) => {
    // Find the contact type by id
    const selectedContact = contact.find(item => item.id === id)
    if (selectedContact) {
      router.push(`/apps/meeting/add?id=${selectedContact.id}`)
    }
  }

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
      minWidth: 150,
      field: 'date',
      headerName: 'Date & Time',
      renderCell: ({ row }: CellType) => (
        <LinkStyled href={'#'}>{formatDate(row.attributes?.date, 'DD-MM-YYYY hh:mm a')}</LinkStyled>
      )
    },
    {
      flex: 0.2,
      minWidth: 230,
      field: 'title',
      headerName: 'Meeting Title',
      renderCell: ({ row }: CellType) => <LinkStyled href={`/companies/${row.id}`}>{row.attributes.title}</LinkStyled>
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'meeting_link',
      headerName: 'Meeting Link',
      renderCell: ({ row }: CellType) => (
        <Typography noWrap variant='body2'>
          {row.attributes.meeting_link}
        </Typography>
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
        await deleteDataFromApi(`/meetings/${deleteId}`)
        setContact(contact.filter(item => item.id !== deleteId))
        setDialogOpen(false)
        toast.success('Meeting deleted successfully')
      } catch (error) {
        console.error('Error deleting Meeting:', error)
        toast.error('Failed to delete Meeting')
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
          <CardHeader title='Meeting List' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <CardContent>
            <TableHeader value={value} handleFilter={handleFilter} selectedRows={[]} />
            <DataGrid
              autoHeight
              rows={filteredContact}
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
        message='Are you sure you want to delete this meeting?'
      />
    </Grid>
  )
}

export default MeetingList
