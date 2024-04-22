// ** React Imports
import { MouseEvent, useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
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
// import axios from 'axios'

import { GetStaticProps } from 'next/types'

// ** Types Imports
import { Menu } from '@mui/material'
import { useDispatch } from 'react-redux'
import { ThemeColor } from 'src/@core/layouts/types'
import { AppDispatch } from 'src/store'
import { deleteUser } from 'src/store/apps/user'
import { fetchDataFromApi } from 'src/utils/api'
import TableHeader from 'src/views/apps/accounts/account-receivable/TableHeader'
import { formatDate } from 'src/utils/dateUtils'

// ** Vars
const companyStatusObj: { [key: string]: ThemeColor } = {
  true: 'success',
  false: 'secondary'
}

interface AccountHeadType {
  id: number
  attributes: {
    journal_no: string
    date: string
    debit_amount: number
    credit_amount: number
    status: boolean
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

interface CellType {
  row: AccountHeadType
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

const RowOptions = ({ id }: { id: number | string }) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    dispatch(deleteUser(id))
    handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='mdi:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          onClick={handleRowOptionsClose}
          href='/apps/user/view/overview/'
        >
          <Icon icon='mdi:eye-outline' fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
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
    flex: 0.1,
    minWidth: 230,
    field: 'date',
    headerName: 'Date',
    renderCell: ({ row }: CellType) => (
      <LinkStyled href={`/companies/${row.id}`}>{formatDate(row.attributes.createdAt)}</LinkStyled>
    )
  },

  {
    flex: 0.2,
    minWidth: 230,
    field: 'client',
    headerName: 'Client',
    renderCell: ({ row }: CellType) => (
      <LinkStyled href={`/companies/${row.id}`}>{row.attributes?.client?.data?.attributes?.name}</LinkStyled>
    )
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'debit_account',
    headerName: 'Account Head',
    renderCell: ({ row }: CellType) => (
      <LinkStyled href={`/companies/${row.id}`}>{row.attributes?.debit_account?.data?.attributes?.name}</LinkStyled>
    )
  },
  {
    flex: 0.1,
    minWidth: 200,
    field: 'amount',
    headerName: 'Amount',
    renderCell: ({ row }: CellType) => <LinkStyled href={`/companies/${row.id}`}>{row.attributes.amount}</LinkStyled>
  },
  {
    flex: 0.1,
    minWidth: 200,
    field: 'due_amount',
    headerName: 'Due Amount',
    renderCell: ({ row }: CellType) => <LinkStyled href={`/companies/${row.id}`}>{row.dueAmount}</LinkStyled>
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
  //       color={companyStatusObj[row.attributes.status]}
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

const AccountHeadList = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [accountReceivableDebitData, setAccountReceivableDebitData] = useState<any[]>([])
  const [accountReceivableCreditData, setAccountReceivableCreditData] = useState<any[]>([])

  console.log('accountReceivableDebitData', accountReceivableDebitData)
  console.log('accountReceivableCreditData', accountReceivableCreditData)

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  useEffect(() => {
    // Fetch companies data from API
    const fetchJournalData = async () => {
      try {
        const accountHeadResponse = await fetchDataFromApi(
          '/individual-accounts?populate=*&filters[short_name][$eq]=ar'
        )
        console.log('accountHeadResponse', accountHeadResponse.data)
        const DebitResponse = await fetchDataFromApi(
          `/journals?populate=*&filters[debit_account][id][$eq]=${accountHeadResponse.data[0].id}`
        )
        const CreditResponse = await fetchDataFromApi(
          `/journals?populate=*&filters[credit_account][id][$eq]=${accountHeadResponse.data[0].id}`
        )
        setAccountReceivableDebitData(DebitResponse.data)
        setAccountReceivableCreditData(CreditResponse.data)
      } catch (error) {
        console.error('Error fetching contact type:', error)
      }
    }
    fetchJournalData()
  }, [])

  // Calculate due amount for each invoice and client combination
  const calculateDueAmount = (debitData: any[], creditData: any[]) => {
    const dueAmounts: { [key: string]: number } = {}

    // Iterate over debit data
    debitData.forEach(debit => {
      const { invoice, client, amount } = debit.attributes

      // If invoice_id and client_id exist, calculate due amount
      if (invoice && client) {
        const key = `${invoice}_${client}`
        dueAmounts[key] = (dueAmounts[key] || 0) + amount
      }
    })

    // Iterate over credit data
    creditData.forEach(credit => {
      const { invoice, client, amount } = credit.attributes

      // If invoice_id and client_id exist, subtract credit amount from due amount
      if (invoice && client) {
        const key = `${invoice}_${client}`
        dueAmounts[key] = (dueAmounts[key] || 0) - amount
      }
    })

    console.log('dueAmounts', dueAmounts)

    return dueAmounts
  }

  // Filter out rows with due amount <= 0
  const filteredData = accountReceivableDebitData
    .map(debit => {
      const { invoice, client } = debit.attributes
      const key = `${invoice}_${client}`
      const dueAmount = calculateDueAmount(accountReceivableDebitData, accountReceivableCreditData)[key]

      return { ...debit, dueAmount: dueAmount }
    })
    .filter(item => item.dueAmount && item.dueAmount > 0)

  console.log('filteredData', filteredData)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Account Receivable List'
            sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
          />
          <CardContent>
            <TableHeader value={value} handleFilter={handleFilter} selectedRows={[]} />
            <DataGrid
              autoHeight
              rows={filteredData}
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

export default AccountHeadList
