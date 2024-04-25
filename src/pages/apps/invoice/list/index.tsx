// ** React Imports
import { forwardRef, useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import { SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from 'src/store/apps/invoice'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { AppDispatch, RootState } from 'src/store'
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Utils Import
import { formatDate } from 'src/utils/dateUtils'

// ** Custom Components Imports
import TableHeader from 'src/views/apps/invoice/list/TableHeader'

// ** Styled Components
import router from 'next/router'
import toast from 'react-hot-toast'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ConfirmDialog from 'src/pages/reuseableComponent/deleteDialouge'
import { deleteDataFromApi, fetchDataFromApi } from 'src/utils/api'

interface InvoiceStatusObj {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
}

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

interface CellType {
  row: any
}

// ** Styled component for the link in the dataTable
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

const defaultColumns: GridColDef[] = [
  {
    sortable: true,
    field: 'slNo',
    headerName: '#sl',
    flex: 0,
    editable: false,
    renderCell: params => params.api.getAllRowIds().indexOf(params.id) + 1
  },
  {
    flex: 0.15,
    minWidth: 125,
    field: 'date',
    headerName: 'Issued Date',
    renderCell: ({ row }: CellType) => (
      <Typography variant='body2'>{formatDate(row?.attributes?.date, 'DD-MM-YYYY')}</Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'invoice_no',
    headerName: 'Inv No.',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{`${row?.attributes?.invoice_no || 0}`}</Typography>
  },
  {
    flex: 0.2,
    field: 'name',
    minWidth: 200,
    headerName: 'Client',
    renderCell: ({ row }: CellType) => {
      console.log('invrow', row)
      const { name, email } = row.attributes?.client?.data?.attributes

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* {renderClient(row)} */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              noWrap
              variant='body2'
              sx={{ color: 'text.primary', fontWeight: 500, lineHeight: '22px', letterSpacing: '.1px' }}
            >
              {name}
            </Typography>
            <Typography noWrap variant='caption'>
              {email}
            </Typography>
          </Box>
        </Box>
      )
    }
  },

  {
    flex: 0.1,
    minWidth: 90,
    field: 'total',
    headerName: 'Total',
    renderCell: ({ row }: CellType) => (
      <Typography variant='body2'>{`${row?.attributes?.total_amount || 0}`}</Typography>
    )
  }
]

/* eslint-disable */
const CustomInput = forwardRef((props: CustomInputProps, ref) => {
  const startDate = props.start !== null ? format(props.start, 'dd/MM/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'dd/MM/yyyy')}` : null

  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
  const updatedProps = { ...props }
  delete updatedProps.setDates

  return <TextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
})
/* eslint-enable */

const InvoiceList = () => {
  // ** State
  const [dates, setDates] = useState<Date[]>([])
  const [value, setValue] = useState<string>('')
  const [statusValue, setStatusValue] = useState<string>('')
  const [endDateRange, setEndDateRange] = useState<DateType>(null)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [startDateRange, setStartDateRange] = useState<DateType>(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [invoice, setInvoice] = useState<any>([])
  const [filteredInvoice, setFilteredInvoice] = useState<any>([])
  const [deleteId, setDeleteId] = useState<string | number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { attributes } = invoice

  console.log('attributes', attributes)

  console.log('invoice', invoice)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.invoice)

  useEffect(() => {
    dispatch(
      fetchData({
        dates,
        q: value,
        status: statusValue
      })
    )
  }, [dispatch, statusValue, value, dates])

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Delete Invoice'>
            <IconButton size='small' sx={{ mr: 0.5 }} onClick={() => handleDeleteClick(row.id)}>
              <Icon icon='mdi:delete-outline' />
            </IconButton>
          </Tooltip>
          <Tooltip title='View'>
            <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/apps/invoice/preview/${row.id}`}>
              <Icon icon='mdi:eye-outline' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Edit'>
            <IconButton size='small' sx={{ mr: 0.5 }} onClick={() => handleEditClick(row.id)}>
              <Icon icon='mdi:pencil-outline' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  const handleFilter = (val: string) => {
    setValue(val)
  }

  const handleStatusValue = (e: SelectChangeEvent) => {
    setStatusValue(e.target.value)
  }

  // const handleOnChangeRange = (dates: any) => {
  //   const [start, end] = dates
  //   if (start !== null && end !== null) {
  //     setDates(dates)
  //   }
  //   setStartDateRange(start)
  //   setEndDateRange(end)
  // }

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates

    // Adjust the end date by adding one day to it
    const adjustedEndDate = end ? new Date(end.getTime() + 24 * 60 * 60 * 1000) : null

    // Filter invoices based on the selected date range
    const filteredInvoices = invoice.filter(inv =>
      inv.attributes?.date && start && adjustedEndDate
        ? new Date(inv.attributes.date) >= start && new Date(inv.attributes.date) <= adjustedEndDate
        : true
    )

    // Update the state with the filtered invoices and the selected date range
    setFilteredInvoice(filteredInvoices)
    setDates(dates)
    setStartDateRange(start)
    setEndDateRange(end)
  }

  const handleEditClick = (id: string | number) => {
    handleEdit(id)
  }

  useEffect(() => {
    const filtered = invoice.filter((inv: any) =>
      inv.attributes?.client?.data?.attributes?.name.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredInvoice(filtered)
  }, [value, invoice])

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetchDataFromApi('/invoice-masters?populate=*')
        setInvoice(response.data)
        setFilteredInvoice(response.data)
      } catch (error) {
        console.error('Error fetching invoice:', error)
      }
    }
    fetchInvoice()
  }, [])

  const handleEdit = (id: string | number) => {
    // Find the contact type by id
    const selectedInvoice = invoice.find(item => item.id === id)
    if (selectedInvoice) {
      router.push(`/apps/invoice/add?id=${selectedInvoice.id}`)
    }
  }

  const handleDeleteConfirm = async () => {
    if (deleteId !== null) {
      try {
        await deleteDataFromApi(`/invoice-masters/${deleteId}`)
        setInvoice(invoice.filter(item => item.id !== deleteId))
        setDialogOpen(false)
        toast.success('Invoice deleted successfully')
      } catch (error) {
        console.error('Error deleting Invoice:', error)
        toast.error('Failed to delete Invoice')
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
                {/* <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id='invoice-status-select'>Invoice Status</InputLabel>

                    <Select
                      fullWidth
                      value={statusValue}
                      sx={{ mr: 4, mb: 2 }}
                      label='Invoice Status'
                      onChange={handleStatusValue}
                      labelId='invoice-status-select'
                    >
                      <MenuItem value=''>none</MenuItem>
                      <MenuItem value='downloaded'>Downloaded</MenuItem>
                      <MenuItem value='draft'>Draft</MenuItem>
                      <MenuItem value='paid'>Paid</MenuItem>
                      <MenuItem value='partial payment'>Partial Payment</MenuItem>
                      <MenuItem value='past due'>Past Due</MenuItem>
                      <MenuItem value='sent'>Sent</MenuItem>
                    </Select>
                  </FormControl>
                </Grid> */}
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
                        label='Invoice Date'
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
            <TableHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter} />
            <DataGrid
              autoHeight
              pagination
              rows={filteredInvoice}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              onRowSelectionModelChange={rows => setSelectedRows(rows)}
            />
          </Card>
        </Grid>
        <ConfirmDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          onConfirm={handleDeleteConfirm}
          title='Confirm Deletion'
          message='Are you sure you want to delete this invoice?'
        />
      </Grid>
    </DatePickerWrapper>
  )
}

export default InvoiceList
