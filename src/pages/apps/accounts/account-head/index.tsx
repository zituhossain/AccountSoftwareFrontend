// ** React Imports
import { useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'

// import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import Tooltip from '@mui/material/Tooltip'
import Link from 'next/link'
import CustomChip from 'src/@core/components/mui/chip'

// ** Types Imports
import router from 'next/router'
import toast from 'react-hot-toast'
import { ThemeColor } from 'src/@core/layouts/types'
import ConfirmDialog from 'src/pages/reuseableComponent/deleteDialouge'
import { deleteDataFromApi, fetchDataFromApi } from 'src/utils/api'
import TableHeader from 'src/views/apps/accounts/TableHeader'

// ** Vars
const companyStatusObj: { [key: string]: ThemeColor } = {
  true: 'success',
  false: 'secondary'
}

interface AccountHead {
  id: number
  attributes: {
    name: string
    status: boolean
    account: {
      data: {
        attributes: {
          name: string
        }
      }
    }
    sub_account: {
      data: {
        attributes: {
          name: string
        }
      }
    }
  }
}

interface CellType {
  row: AccountHead
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

const AccountHeadList = () => {
  // ** State
  const [accountHead, setAccountHead] = useState<AccountHead[]>([])
  const [value, setValue] = useState<string>('')

  const [deleteId, setDeleteId] = useState<string | number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  useEffect(() => {
    // Fetch companies data from API
    const fetchAccountHead = async () => {
      try {
        const response = await fetchDataFromApi('/individual-accounts?populate=*')
        setAccountHead(response.data)
      } catch (error) {
        console.error('Error fetching contact type:', error)
      }
    }
    fetchAccountHead()
  }, [])

  const handleEdit = (id: string | number) => {
    // Find the contact type by id
    const selectedAccountHead = accountHead.find(item => item.id === id)
    if (selectedAccountHead) {
      router.push(`/apps/accounts/account-head/add?id=${selectedAccountHead.id}`)
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
      field: 'name',
      headerName: 'Account Head',
      renderCell: ({ row }: CellType) => <LinkStyled href={`/companies/${row.id}`}>{row.attributes?.name}</LinkStyled>
    },
    {
      flex: 0.2,
      minWidth: 230,
      field: 'account',
      headerName: 'Account',
      renderCell: ({ row }: CellType) => (
        <LinkStyled href='#'>{row.attributes?.account?.data?.attributes?.name}</LinkStyled>
      )
    },
    {
      flex: 0.2,
      minWidth: 230,
      field: 'sub_account',
      headerName: 'Sub Account',
      renderCell: ({ row }: CellType) => (
        <LinkStyled href={`/companies/${row.id}`}>{row.attributes?.sub_account?.data?.attributes?.name}</LinkStyled>
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

  const handleDeleteConfirm = async () => {
    if (deleteId !== null) {
      try {
        await deleteDataFromApi(`/individual-accounts/${deleteId}`)
        setAccountHead(accountHead.filter(item => item.id !== deleteId))
        setDialogOpen(false)
        toast.success('Account Head deleted successfully')
      } catch (error) {
        console.error('Error deleting Account Head:', error)
        toast.error('Failed to delete Account Head')
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
          <CardHeader title='Account Head List' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <CardContent>
            <TableHeader value={value} handleFilter={handleFilter} selectedRows={[]} />
            <DataGrid
              autoHeight
              rows={accountHead}
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
        message='Are you sure you want to delete this Account Head?'
      />
    </Grid>
  )
}

export default AccountHeadList
