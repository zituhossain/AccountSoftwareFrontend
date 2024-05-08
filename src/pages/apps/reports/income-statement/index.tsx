import { Button, Card, Grid, Typography } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import TextField from '@mui/material/TextField'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import format from 'date-fns/format'
import { forwardRef, useEffect, useState, useRef } from 'react'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { fetchDataFromApi } from 'src/utils/api'
import { ReactToPrint } from 'react-to-print'

const CustomInput = forwardRef(({ start, end, label, ...props }, ref) => {
  const displayStart = start ? format(start, 'dd/MM/yyyy') : ''
  const displayEnd = end ? ` - ${format(end, 'dd/MM/yyyy')}` : ''
  const value = `${displayStart}${displayEnd}`

  return <TextField ref={ref} fullWidth label={label || 'Date'} value={value} {...props} />
})

const IncomeStatement = () => {
  const [data, setData] = useState([])
  const [startDate, setStartDate] = useState(new Date('2024-01-01'))
  const [endDate, setEndDate] = useState(new Date())
  const componentRef = useRef()

  useEffect(() => {
    const fetchData = async () => {
      const startDateISO = startDate.toISOString().split('T')[0]
      const endDateISO = endDate.toISOString().split('T')[0]

      try {
        const revenueHeadResponse = await fetchDataFromApi(
          `/individual-accounts?populate=*&filters[short_name][$eq]=ar`
        )

        const expenseHeadResponse = await fetchDataFromApi(
          `/individual-accounts?populate=id&filters[account][id][$eq]=5`
        )

        const revenueHeadIds = revenueHeadResponse.data.map((item: { id: any }) => item.id).join(',')
        const expenseHeadIds = expenseHeadResponse.data.map((item: { id: any }) => item.id).join(',')

        const revenuesResponse = await fetchDataFromApi(
          `/journals/revenue/${revenueHeadIds}?startDate=${startDateISO}&endDate=${endDateISO}`
        )

        const expensesResponse = await fetchDataFromApi(
          `/journals/expense/${expenseHeadIds}?startDate=${startDateISO}&endDate=${endDateISO}`
        )

        // const revenuesResponse = await fetchDataFromApi(`/journals/revenue/${revenueHeadIds}`)

        // const expensesResponse = await fetchDataFromApi(`/journals/expense/${expenseHeadIds}`)

        const revenues = revenuesResponse.map((item, index) => ({
          id: `revenue_${index}`,
          details: 'Service Revenue',
          amount1: null,
          amount2: item.amount,
          isHeading: false
        }))

        const expenses = expensesResponse.map((item, index) => ({
          id: `expense_${index}`,
          details: item.name,
          amount1: item.amount,
          amount2: null,
          isHeading: false
        }))

        const totalRevenue = revenues.reduce((acc, cur) => acc + (cur.amount2 || 0), 0)
        const totalExpenses = expenses.reduce((acc, cur) => acc + (cur.amount1 || 0), 0)
        const netIncome = totalRevenue - totalExpenses

        setData([
          { id: 'revenue_heading', details: 'Revenues:', amount1: null, amount2: null, isHeading: true },
          ...revenues,
          { id: 'totalRevenue', details: 'Total Revenues', amount1: null, amount2: null, total: totalRevenue },
          { id: 'expense_heading', details: 'Expenses:', amount1: null, amount2: null, isHeading: true },
          ...expenses,
          { id: 'totalExpenses', details: 'Total Expenses', amount1: null, amount2: null, total: `(${totalExpenses})` },
          { id: 'Net Income', details: 'Net Income', amount1: null, amount2: null, total: netIncome }
        ])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [startDate, endDate])

  const columns: GridColDef[] = [
    { field: 'details', headerName: 'Details', flex: 1 },
    { field: 'amount1', headerName: 'Expense (Tk.)', flex: 1, type: 'number', align: 'right', headerAlign: 'right' },
    { field: 'amount2', headerName: 'Revenue (Tk.)', flex: 1, type: 'number', align: 'right', headerAlign: 'right' },
    { field: 'total', headerName: 'Total (Tk.)', flex: 1, type: 'number', align: 'right', headerAlign: 'right' }
  ]

  const renderDetailsCell = params => {
    if (params.row.isHeading) {
      return (
        <Typography variant='h6' style={{ fontWeight: 'bold' }}>
          {params.value}
        </Typography>
      )
    }

    return params.value
  }

  return (
    <div>
      <DatePickerWrapper>
        <Grid container spacing={6} ref={componentRef}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h6' component='div' sx={{ mb: 2 }}>
                  Select Start Date:
                </Typography>
                <DatePicker
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  dateFormat='dd/MM/yyyy'
                  customInput={<CustomInput label='Start Date' />}
                />
                <Typography variant='h6' component='div' sx={{ mb: 2, mt: 2 }}>
                  Select End Date:
                </Typography>
                <DatePicker
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                  dateFormat='dd/MM/yyyy'
                  customInput={<CustomInput label='End Date' />}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <Typography variant='h6' component='div' sx={{ pt: 4, textAlign: 'center' }}>
                Income Statement
              </Typography>

              <CardContent>
                <DataGrid
                  autoHeight
                  rows={data}
                  columns={columns.map(column => ({
                    ...column,
                    renderCell: renderDetailsCell
                  }))}
                  disableSelectionOnClick
                  pageSize={10}
                  sx={{
                    '& .MuiDataGrid-columnHeaders': { borderRadius: 0 },
                    '& .MuiDataGrid-row': {
                      '&:nth-of-type(even)': { backgroundColor: 'rgba(235, 235, 235, .7)' },
                      '&:nth-of-type(odd)': { backgroundColor: 'rgba(250, 250, 250, .7)' }
                    }
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
      </DatePickerWrapper>
      <ReactToPrint trigger={() => <Button variant='contained'>Print</Button>} content={() => componentRef.current} />
    </div>
  )
}

export default IncomeStatement
