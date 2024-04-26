// ** React Imports
import { forwardRef, useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'

import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import { Box } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import Link from 'next/link'

// ** Types Imports
import router from 'next/router'
import toast from 'react-hot-toast'
import { ThemeColor } from 'src/@core/layouts/types'
import ConfirmDialog from 'src/pages/reuseableComponent/deleteDialouge'
import { deleteDataFromApi, fetchDataFromApi } from 'src/utils/api'
import { formatDate } from 'src/utils/dateUtils'
import TableHeader from 'src/views/apps/accounts/journal/TableHeader'

import format from 'date-fns/format'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Vars
const companyStatusObj: { [key: string]: ThemeColor } = {
  true: 'success',
  false: 'secondary'
}

interface JournalListProps {
  id: number
  attributes: {
    date: string
    debit_account: {
      data: {
        attributes: {
          name: string
        }
      }
    }
    credit_account: {
      data: {
        attributes: {
          name: string
        }
      }
    }
    amount: number
    status: boolean
    createdAt: string
  }
}

interface CellType {
  row: JournalListProps
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

const JournalList = () => {
  // ** State
  const [journals, setJournals] = useState<JournalListProps[]>([])
  const [filteredJournals, setFilteredJournals] = useState<JournalListProps[]>([])
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
    const filteredJournals = journals.filter(journal =>
      journal.attributes?.createdAt && start && adjustedEndDate
        ? new Date(journal.attributes.createdAt) >= start && new Date(journal.attributes.createdAt) <= adjustedEndDate
        : true
    )

    // Update the state with the filtered invoices and the selected date range
    setFilteredJournals(filteredJournals)
    setDates(dates)
    setStartDateRange(start)
    setEndDateRange(end)
  }

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  useEffect(() => {
    const filtered = journals.filter(journal =>
      journal.attributes?.client?.data?.attributes?.name.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredJournals(filtered)
  }, [value, journals])

  useEffect(() => {
    // Fetch companies data from API
    const fetchJournals = async () => {
      try {
        const response = await fetchDataFromApi('/journals?populate=*')
        console.log('journalzitu=======>', response.data)
        setJournals(response.data)
        setFilteredJournals(response.data)
      } catch (error) {
        console.error('Error fetching contact type:', error)
      }
    }
    fetchJournals()
  }, [])

  const handleEdit = (id: string | number) => {
    // Find the contact type by id
    const selectedAccountHead = accountHead.find(item => item.id === id)
    if (selectedAccountHead) {
      router.push(`/apps/accounts/journal/add?id=${selectedAccountHead.id}`)
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
      minWidth: 150,
      field: 'createdAt',
      headerName: 'Date',
      renderCell: ({ row }: CellType) => (
        <LinkStyled href='#'>{formatDate(row.attributes?.createdAt, 'DD-MM-YYYY')}</LinkStyled>
      )
    },
    {
      flex: 0.25,
      field: 'name',
      minWidth: 220,
      headerName: 'Client',
      renderCell: ({ row }: CellType) => {
        const { name, email } = row.attributes?.client?.data?.attributes

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
      flex: 0.2,
      minWidth: 200,
      field: 'debit_account',
      headerName: 'Debit Account',
      renderCell: ({ row }: CellType) => (
        <LinkStyled href='#'>{row.attributes?.debit_account?.data?.attributes?.name}</LinkStyled>
      )
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'credit_account',
      headerName: 'Credit Account',
      renderCell: ({ row }: CellType) => (
        <LinkStyled href='#'>{row.attributes?.credit_account?.data?.attributes?.name}</LinkStyled>
      )
    },
    {
      flex: 0.2,
      minWidth: 100,
      field: 'amount',
      headerName: 'Amount',
      renderCell: ({ row }: CellType) => <LinkStyled href='#'>{row.attributes?.amount}</LinkStyled>
    },

    // {
    //   flex: 0.1,
    //   minWidth: 90,
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
      flex: 0.2,
      minWidth: 120,
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
        setJournals(journals.filter(item => item.id !== deleteId))
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
                        label='Journal Date'
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
            <CardHeader title='Journal List' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
            <CardContent>
              <TableHeader value={value} handleFilter={handleFilter} selectedRows={[]} />
              <DataGrid
                autoHeight
                rows={filteredJournals}
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
    </DatePickerWrapper>
  )
}

export default JournalList
