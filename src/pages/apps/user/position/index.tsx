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

// ** Types Imports
import { UserRoleType } from 'src/types/apps/userTypes'

// ** Custom Table Components Imports
import Tooltip from '@mui/material/Tooltip'
import router from 'next/router'
import toast from 'react-hot-toast'
import { ThemeColor } from 'src/@core/layouts/types'
import ConfirmDialog from 'src/pages/reuseableComponent/deleteDialouge'
import { deleteDataFromApi, fetchDataFromApi } from 'src/utils/api'
import TableHeader from 'src/views/apps/user/position/TableHeader'

interface CellType {
  row: UserRoleType
}

const userStatusObj: { [key: string]: ThemeColor } = {
  true: 'success',
  false: 'secondary'
}

const PositionList = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [position, setPosition] = useState<UserRoleType[]>([])
  const [filteredPosition, setFilteredPosition] = useState([])
  const [deleteId, setDeleteId] = useState<string | number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    // Fetch companies data from API
    const fetchPosition = async () => {
      try {
        const response = await fetchDataFromApi('/organizational-positions?populate=*')
        setPosition(response.data)
        setFilteredPosition(response.data)
      } catch (error) {
        console.error('Error fetching position:', error)
      }
    }
    fetchPosition()
  }, [])

  useEffect(() => {
    const filtered = position.filter(pos => pos.attributes.title.toLowerCase().includes(value.toLowerCase()))
    setFilteredPosition(filtered)
  }, [value, position])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  const handleEdit = (id: string | number) => {
    const selectedPosition = position.find(item => item.id === id)
    if (selectedPosition) {
      router.push(`/apps/user/position/add?id=${selectedPosition.id}`)
    }
  }

  const RowOptions = ({ id }: { id: number | string }) => {
    const handleEditClick = (id: string | number) => {
      handleEdit(id)
    }

    return (
      <>
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
      field: 'title',
      headerName: 'Title',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.attributes.title}
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
            label={row.attributes.status ? 'Active' : 'Inactive'}
            color={userStatusObj[row.attributes.status]}
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
        await deleteDataFromApi(`/organizational-positions/${deleteId}`)
        setPosition(position.filter(item => item.id !== deleteId))
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
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Position List' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
            <Divider />
            <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
            <DataGrid
              autoHeight
              rows={filteredPosition}
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
        <ConfirmDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          onConfirm={handleDeleteConfirm}
          title='Confirm Deletion'
          message='Are you sure you want to delete this Position?'
        />
      </Grid>
    </>
  )
}

export default PositionList
