// ** React Imports
import { forwardRef, useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
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

// ** Third Party Components
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { DateType } from 'src/types/forms/reactDatepickerTypes'

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

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
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

const CustomInput = forwardRef((props: CustomInputProps, ref) => {
  const startDate = props.start !== null ? format(props.start, 'dd/MM/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'dd/MM/yyyy')}` : null

  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
  const updatedProps = { ...props }
  delete updatedProps.setDates

  return <TextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
})

const AccountHeadList = () => {
  // ** State
  const [transactionData, setTransactionData] = useState<TransactionType[]>([])
  const [filteredTransactionData, setFilteredTransactionData] = useState<TransactionType[]>([])
  const [value, setValue] = useState<string>('')

  const [dates, setDates] = useState<Date[]>([])
  const [startDateRange, setStartDateRange] = useState<DateType>(null)
  const [endDateRange, setEndDateRange] = useState<DateType>(null)

  const [deleteId, setDeleteId] = useState<string | number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates

    // Adjust the end date by adding one day to it
    const adjustedEndDate = end ? new Date(end.getTime() + 24 * 60 * 60 * 1000) : null

    // Filter journal based on the selected date range
    const filteredTransactions = transactionData.filter(transaction =>
      transaction.attributes?.createdAt && start && adjustedEndDate
        ? new Date(transaction.attributes.createdAt) >= start &&
          new Date(transaction.attributes.createdAt) <= adjustedEndDate
        : true
    )

    // Update the state with the filtered invoices and the selected date range
    setFilteredTransactionData(filteredTransactions)
    setDates(dates)
    setStartDateRange(start)
    setEndDateRange(end)
  }

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  useEffect(() => {
    const filtered = transactionData.filter(transaction =>
      transaction.attributes?.account_header?.data?.attributes?.name.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredTransactionData(filtered)
  }, [value, transactionData])

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetchDataFromApi('/transactions?populate=*')
        setTransactionData(response.data)
        setFilteredTransactionData(response.data)
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
        <LinkStyled href={'#'}>{formatDate(row.attributes?.createdAt, 'DD-MM-YYYY')}</LinkStyled>
      )
    },
    {
      flex: 0.3,
      minWidth: 150,
      field: 'account_head',
      headerName: 'Account Head',
      renderCell: ({ row }: CellType) => (
        <LinkStyled href={`#`}>{row.attributes?.account_header?.data?.attributes?.name}</LinkStyled>
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
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Filters By Date' />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    isClearable
                    selectsRange
                    monthsShown={2}
                    endDate={endDateRange}
                    selected={startDateRange}
                    startDate={startDateRange}
                    shouldCloseOnSelect={false}
                    id='date-range-picker-months'
                    onChange={handleOnChangeRange}
                    customInput={
                      <CustomInput
                        dates={dates}
                        setDates={setDates}
                        label='Transaction Date'
                        end={endDateRange as number | Date}
                        start={startDateRange as number | Date}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Transaction List' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
            <CardContent>
              <TableHeader value={value} handleFilter={handleFilter} selectedRows={[]} />
              <DataGrid
                autoHeight
                rows={filteredTransactionData}
                columns={columns}
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
    </DatePickerWrapper>
  )
}

export default AccountHeadList
