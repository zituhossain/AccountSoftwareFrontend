// ** React Imports
import { useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import { UsersTypeFromStrapi } from 'src/types/apps/allTypes'

// ** Custom Table Components Imports
import router, { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { ThemeColor } from 'src/@core/layouts/types'
import ConfirmDialog from 'src/pages/reuseableComponent/deleteDialouge'
import { deleteDataFromApi, fetchDataFromApi } from 'src/utils/api'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import TableHeader from 'src/views/apps/user/list/TableHeader'
import Tooltip from '@mui/material/Tooltip'

interface CellType {
  row: UsersTypeFromStrapi
}

const userStatusObj: { [key: string]: ThemeColor } = {
  true: 'success',
  false: 'secondary'
}

// ** renders client column
// const renderClient = (row: UsersTypeFromStrapi) => {
//   if (row.avatar) {
//     return <CustomAvatar src={row.avatar} sx={{ mr: 3, width: 34, height: 34 }} />
//   } else {
//     return (
//       <CustomAvatar
//         skin='light'
//         color={row.avatarColor || 'primary'}
//         sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
//       >
//         {getInitials(row.username ? row.username : 'John Doe')}
//       </CustomAvatar>
//     )
//   }
// }

const UserList = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [users, setUsers] = useState<UsersTypeFromStrapi[]>([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [deleteId, setDeleteId] = useState<string | number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    // Fetch companies data from API
    const fetchCompanies = async () => {
      try {
        const response = await fetchDataFromApi('/users?populate=*')
        setUsers(response)
      } catch (error) {
        console.error('Error fetching companies:', error)
      }
    }
    fetchCompanies()
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchDataFromApi('/users?populate=*')
        setUsers(response)
        setFilteredUsers(response) // Initialize filteredUsers with all users initially
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(user => user.username.toLowerCase().includes(value.toLowerCase()))
    setFilteredUsers(filtered)
  }, [value, users])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  const handleEdit = (id: string | number) => {
    const selectedUser = users.find(item => item.id === id)
    if (selectedUser) {
      router.push(`/apps/user/add?id=${selectedUser.id}`)
    }
  }

  const RowOptions = ({ id }: { id: number | string }) => {
    const router = useRouter()
    const handleView = () => {
      router.push(`/apps/user/view/${id}`)
    }

    const handleEditClick = (id: string | number) => {
      handleEdit(id)
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
      field: 'username',
      headerName: 'User',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.username}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'email',
      headerName: 'Email',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.email}
          </Typography>
        )
      }
    },

    {
      flex: 0.15,
      field: 'position',
      minWidth: 150,
      headerName: 'Position',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.organizational_position?.title}
          </Typography>
        )
      }
    },

    {
      flex: 0.1,
      minWidth: 110,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => {
        return (
          <CustomChip
            skin='light'
            size='small'
            label={row.confirmed ? 'Active' : 'Inactive'}
            color={userStatusObj[row.confirmed]}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
        )
      }
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
        await deleteDataFromApi(`/users/${deleteId}`)
        setUsers(users.filter(item => item.id !== deleteId))
        setDialogOpen(false)
        toast.success('User deleted successfully')
      } catch (error) {
        console.error('Error deleting User:', error)
        toast.error('Failed to delete User')
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
          <CardHeader title='Search Users' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <Divider />
          <TableHeader value={value} handleFilter={handleFilter} />
          <DataGrid
            autoHeight
            rows={filteredUsers}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
          />
        </Card>
      </Grid>

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
      <ConfirmDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this user?'
      />
    </Grid>
  )
}

export default UserList
