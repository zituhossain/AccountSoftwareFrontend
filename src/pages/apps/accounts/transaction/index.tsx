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

// ** Third Party Components
// import axios from 'axios'

// ** Types Imports
import router from 'next/router'
import toast from 'react-hot-toast'
import { ThemeColor } from 'src/@core/layouts/types'
import ConfirmDialog from 'src/pages/reuseableComponent/deleteDialouge'
import { deleteDataFromApi, fetchDataFromApi } from 'src/utils/api'
import { formatDate } from 'src/utils/dateUtils'
import TableHeader from 'src/views/apps/accounts/transaction/TableHeader'

// ** Vars
const companyStatusObj: { [key: string]: ThemeColor } = {
  true: 'success',
  false: 'secondary'
}

interface TransactionType {
  id: number
  attributes: {
    account_headers: number
    company: number
    client: number
    payment_option: number
    created_user: number
    total_amount: number
    notes: string
    status: boolean
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
  }
}

interface CellType {
  row: TransactionType
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
  const [value, setValue] = useState<string>('')
  const [transactionData, setTransactionData] = useState<TransactionType[]>([])

  const [deleteId, setDeleteId] = useState<string | number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        let apiUrl = '/transactions?populate=*'
        if (value.trim() !== '') {
          apiUrl += `&filters[invoice_id][invoice_no][$containsi]=${value}`
        }

        const response = await fetchDataFromApi(apiUrl)
        setTransactionData(response.data)
      } catch (error) {
        console.error('Error fetching transactions:', error)
      }
    }
    fetchTransaction()
  }, [value])

  const handleEdit = (id: string | number) => {
    // Find the contact type by id
    const selectedTransaction = transactionData.find(item => item.id === id)
    if (selectedTransaction) {
      router.push(`/apps/accounts/transaction/add?id=${selectedTransaction.id}`)
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
      headerName: 'sl No.',
      flex: 0,
      editable: false,
      renderCell: params => params.api.getAllRowIds().indexOf(params.id) + 1
    },

    // {
    //   flex: 0.2,
    //   minWidth: 230,
    //   field: 'journal_no',
    //   headerName: 'Journal No',
    //   renderCell: ({ row }: CellType) => (
    //     <LinkStyled href={`/companies/${row.id}`}>{row.attributes.journal_no}</LinkStyled>
    //   )
    // },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'date',
      headerName: 'Date',
      renderCell: ({ row }: CellType) => (
        <LinkStyled href={'#'}>{formatDate(row.attributes?.createdAt, 'YYYY-MM-DD')}</LinkStyled>
      )
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'invoice_no',
      headerName: 'Invoice No.',
      renderCell: ({ row }: CellType) => (
        <LinkStyled href={`#`}># {row.attributes?.invoice_id?.data?.attributes?.invoice_no}</LinkStyled>
      )
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'account_head',
      headerName: 'Account Head',
      renderCell: ({ row }: CellType) => (
        <LinkStyled href={`#`}>{row.attributes?.account_headers?.data?.attributes?.head_title}</LinkStyled>
      )
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'payment_option',
      headerName: 'Payment By',
      renderCell: ({ row }: CellType) => (
        <LinkStyled href={'#'}>
          {row.attributes.payment_option == 0 ? 'Cash' : row.attributes.payment_option == 1 ? 'Check' : 'MFS'}
        </LinkStyled>
      )
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'total_amount',
      headerName: 'Total Amount',
      renderCell: ({ row }: CellType) => <LinkStyled href={'#'}>{row.attributes.total_amount}</LinkStyled>
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'paid_amount',
      headerName: 'Paid',
      renderCell: ({ row }: CellType) => <LinkStyled href={'#'}>{row.attributes.paid_amount}</LinkStyled>
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'due_amount',
      headerName: 'Due',
      renderCell: ({ row }: CellType) => <LinkStyled href={'#'}>{row.attributes.due_amount}</LinkStyled>
    },

    // {
    //   flex: 0.1,
    //   minWidth: 110,
    //   field: 'status',
    //   headerName: 'Status',
    //   renderCell: ({ row }: CellType) => (
    //     <CustomChip
    //       skin='light'
    //       size='small'
    //       label={row.attributes.status ? 'Active' : 'Inactive'}
    //       color={companyStatusObj[row.attributes.status.toString()]}
    //       sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
    //     />
    //   )
    // },
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
        await deleteDataFromApi(`/transactions/${deleteId}`)
        setTransactionData(transactionData.filter(item => item.id !== deleteId))
        setDialogOpen(false)
        toast.success('Transactions deleted successfully')
      } catch (error) {
        console.error('Error deleting Transactions:', error)
        toast.error('Failed to delete Transactions')
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
          <CardHeader title='Transaction List' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <CardContent>
            <TableHeader value={value} handleFilter={handleFilter} selectedRows={[]} />
            <DataGrid
              autoHeight
              rows={transactionData}
              columns={columns}
              // checkboxSelection
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
