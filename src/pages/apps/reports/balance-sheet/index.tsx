import { forwardRef, useEffect, useRef, useState } from 'react'
import { ReactToPrint } from 'react-to-print'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Button, Card, Grid, Typography } from '@mui/material'
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { fetchDataFromApi } from 'src/utils/api'

const CustomInput = forwardRef(({ start, end, label, ...props }, ref) => {
  const displayStart = start ? format(start, 'dd/MM/yyyy') : ''
  const displayEnd = end ? ` - ${format(end, 'dd/MM/yyyy')}` : ''
  const value = `${displayStart}${displayEnd}`

  return <TextField ref={ref} fullWidth label={label || 'Date'} value={value} {...props} />
})

const BalanceSheet = () => {
  const [data, setData] = useState([])
  const [startDate, setStartDate] = useState(new Date('2024-01-01'))
  const [endDate, setEndDate] = useState(new Date())
  const componentRef = useRef()
  const [company, setCompany] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const startDateISO = startDate.toISOString().split('T')[0]
      const endDateISO = endDate.toISOString().split('T')[0]
      try {
        const userData = JSON.parse(localStorage.getItem('userData')!)
        const userResponse = await fetchDataFromApi(`/users/${userData.id}?populate=company`)

        const company = userResponse.company
        setCompany(company.name)

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
          { id: 'asset_heading', details: 'Assets:', amount1: null, amount2: null, isHeading: true },
          { id: 'current_asset_heading', details: 'Current Assets', amount1: null, amount2: null },
          { id: 'fixed_asset_heading', details: 'Fixed Assets', amount1: null, amount2: null },
          ...revenues,
          { id: 'totalAssets', details: 'Total Assets', amount1: null, amount2: null, total: totalRevenue },
          {
            id: 'liabilities_equity_heading',
            details: `Liabilities & Ownwer's Equity:`,
            amount1: null,
            amount2: null,
            isHeading: true
          },
          {
            id: 'current_liabilities_heading',
            details: `Current Liabilities`,
            amount1: null,
            amount2: null
          },
          {
            id: 'fixed_liabilities_heading',
            details: `Fixed Liabilities`,
            amount1: null,
            amount2: null
          },
          { id: 'equity_heading', details: `Ownwer's Equity`, amount1: null, amount2: null },
          ...expenses,
          {
            id: 'totalLiabilitiesEquity',
            details: `Total Liabilities & Owner's Equity`,
            amount1: null,
            amount2: null,
            total: netIncome
          }
        ])
      } catch (error) {
        console.error('Error fetching data:', error)

        // Handle errors appropriately (e.g., show error message to user)
      }
    }

    fetchData()
  }, [])

  const columns: GridColDef[] = [
    { field: 'details', headerName: 'Details', flex: 1 },
    { field: 'amount1', headerName: 'Asset (Tk.)', flex: 1, type: 'number', align: 'left', headerAlign: 'left' },
    {
      field: 'amount2',
      headerName: 'Liabilities & equity (Tk.)',
      flex: 1,
      type: 'number',
      align: 'left',
      headerAlign: 'left'
    },
    { field: 'total', headerName: 'Total (Tk.)', flex: 1, type: 'number', align: 'left', headerAlign: 'left' }
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
        <Grid container spacing={6}>
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
          <Grid item xs={12} ref={componentRef}>
            <Card>
              <Typography variant='h6' component='div' sx={{ pt: 4, textAlign: 'center' }}>
                Balance Sheet
                <Typography>{company}</Typography>
                <Typography>{`${format(startDate, 'd MMMM, yyyy')} To ${format(endDate, 'd MMMM, yyyy')}`}</Typography>
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

export default BalanceSheet
