// ** React Imports
import { useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'

// import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import Link from 'next/link'

// ** Types Imports
import router from 'next/router'
import { useDispatch } from 'react-redux'
import { ThemeColor } from 'src/@core/layouts/types'
import { AppDispatch } from 'src/store'
import { fetchDataFromApi } from 'src/utils/api'
import { formatDate } from 'src/utils/dateUtils'
import TableHeader from 'src/views/apps/accounts/account-receivable/TableHeader'
import ReceivePayment from './payment/receivePayment'

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

const AccountReceivableList = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [accountReceivableDebitData, setAccountReceivableDebitData] = useState<any[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [paymentId, setPaymentId] = useState<string | number>('')
  const [dueAmountById, setDueAmountById] = useState<number>(0)

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountHeadResponse = await fetchDataFromApi(
          '/individual-accounts?populate=*&filters[short_name][$eq]=ar'
        )
        const DebitResponse = await fetchDataFromApi(
          `/journals?populate=*&filters[debit_account][id][$eq]=${accountHeadResponse.data[0].id}`
        )

        const debitData = DebitResponse.data

        // Calculate due amount for each item in debitData
        const filteredData = await Promise.all(
          debitData.map(async (debit: any) => {
            const { invoice, client, debit_account, amount } = debit.attributes
            const dueAmount = await calculateDueAmount(invoice.data.id, client.data.id, debit_account.data.id)

            return { ...debit, dueAmount: amount - dueAmount }
          })
        )

        // Filter out rows where dueAmount > 0
        const filteredPositiveDueAmountData = filteredData.filter(row => row.dueAmount > 0)

        // Set the filtered data state
        setAccountReceivableDebitData(filteredPositiveDueAmountData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  // Calculate due amount for each invoice and client combination
  const calculateDueAmount = async (invoice: any, client: any, accountHead: any) => {
    try {
      const CreditResponse = await fetchDataFromApi(
        `/journals?populate=*&filters[credit_account][id][$eq]=${accountHead}&filters[client][id][$eq]=${client}&filters[invoice][id][$eq]=${invoice}`
      )

      let dueAmounts = 0

      if (CreditResponse.data.length > 0) {
        dueAmounts = CreditResponse.data.map(obj => obj.attributes.amount).reduce((acc, curr) => acc + curr, 0)
      }

      return dueAmounts
    } catch (error) {
      console.error('Error calculating due amount:', error)

      return 0 // Return 0 if an error occurs
    }
  }

  const RowOptions = ({ id, dueAmount }: { id: number | string; dueAmount: number }) => {
    // ** Hooks
    const dispatch = useDispatch<AppDispatch>()

    const handleView = () => {
      router.push(`/apps/accounts/account-receivable/view/${id}`)
    }

    return (
      <>
        <Tooltip title='Receive Payment' placement='top'>
          <IconButton size='small' onClick={() => handlePaymentClick(id, dueAmount)}>
            <Icon icon='mdi:cash-multiple' />
          </IconButton>
        </Tooltip>
        <Tooltip title='View' placement='top'>
          <IconButton size='small' onClick={handleView}>
            <Icon icon='mdi:eye-outline' />
          </IconButton>
        </Tooltip>
        {/* <Tooltip title='Edit' placement='top'>
          <IconButton size='small'>
            <Icon icon='mdi:pencil-outline' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Delete' placement='top'>
          <IconButton size='small'>
            <Icon icon='mdi:delete-outline' />
          </IconButton>
        </Tooltip> */}
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
      minWidth: 200,
      field: 'date',
      headerName: 'Date',
      renderCell: ({ row }: CellType) => <LinkStyled href='#'>{formatDate(row.attributes.createdAt)}</LinkStyled>
    },

    {
      flex: 0.2,
      minWidth: 200,
      field: 'client',
      headerName: 'Client',
      renderCell: ({ row }: CellType) => (
        <LinkStyled href='#'>{row.attributes?.client?.data?.attributes?.name}</LinkStyled>
      )
    },
    {
      flex: 0.2,
      minWidth: 230,
      field: 'debit_account',
      headerName: 'Account Head',
      renderCell: ({ row }: CellType) => (
        <LinkStyled href='#'>{row.attributes?.debit_account?.data?.attributes?.name}</LinkStyled>
      )
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'amount',
      headerName: 'Amount',
      renderCell: ({ row }: CellType) => <LinkStyled href='#'>{row.attributes.amount}</LinkStyled>
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'due_amount',
      headerName: 'Due Amount',
      renderCell: ({ row }: CellType) => <LinkStyled href='#'>{row.dueAmount}</LinkStyled>
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
      renderCell: ({ row }: CellType) => <RowOptions id={row.id} dueAmount={row.dueAmount} />
    }
  ]

  const handlePaymentClick = (id: string | number, dueAmount: number) => {
    setPaymentId(id)
    setDueAmountById(dueAmount)
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
            title='Account Receivable List'
            sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
          />
          <CardContent>
            <TableHeader value={value} handleFilter={handleFilter} selectedRows={[]} />
            <DataGrid
              autoHeight
              rows={accountReceivableDebitData}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            />
          </CardContent>
        </Card>
      </Grid>
      {dialogOpen && (
        <ReceivePayment
          dueAmountById={dueAmountById}
          open={dialogOpen}
          onClose={handleDialogClose}
          paymentId={paymentId}
          title='Receive Payment'
        />
      )}
    </Grid>
  )
}

export default AccountReceivableList
