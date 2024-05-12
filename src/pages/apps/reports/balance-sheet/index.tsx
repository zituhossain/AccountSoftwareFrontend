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
import aggregateAmountsCurrentAsset from 'src/utils/aggregateAmount'
import aggregateAmountsCurrentLiabilities from 'src/utils/aggregateAmount2'

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

        const fixedAssetHeadResponse = await fetchDataFromApi(
          `/individual-accounts?populate=id&filters[account][id][$eq]=1&filters[sub_account][id][$eq]=2`
        )

        const currentAssetHeadResponse = await fetchDataFromApi(
          `/individual-accounts?populate=id&filters[account][id][$eq]=1&filters[sub_account][id][$eq]=1`
        )

        const fixedLiabilitiesHeadResponse = await fetchDataFromApi(
          `/individual-accounts?populate=id&filters[account][id][$eq]=2&filters[sub_account][id][$eq]=2`
        )

        const currentLiabilitiesHeadResponse = await fetchDataFromApi(
          `/individual-accounts?populate=id&filters[account][id][$eq]=2&filters[sub_account][id][$eq]=1`
        )

        const equityHeadResponse = await fetchDataFromApi(
          `/individual-accounts?populate=id&filters[account][id][$eq]=3`
        )

        const fixedAssetHeadIds = fixedAssetHeadResponse.data.map((item: { id: any }) => item.id).join(',')
        const currentAssetHeadIds = currentAssetHeadResponse.data.map((item: { id: any }) => item.id).join(',')
        const fixedLiabilitiesHeadIds = fixedLiabilitiesHeadResponse.data.map((item: { id: any }) => item.id).join(',')
        const currentLiabilitiesHeadIds = currentLiabilitiesHeadResponse.data
          .map((item: { id: any }) => item.id)
          .join(',')
        const equityHeadIds = equityHeadResponse.data.map((item: { id: any }) => item.id).join(',')

        console.log('currentLiabilitiesHeadIds:', currentLiabilitiesHeadIds)

        const fixedAssetResponse = await fetchDataFromApi(
          `/journals/fixedAsset/${
            fixedAssetHeadIds ? fixedAssetHeadIds : 0
          }?startDate=${startDateISO}&endDate=${endDateISO}`
        )

        const currentAssetResponse = await fetchDataFromApi(
          `/journals/currentAsset/${
            currentAssetHeadIds ? currentAssetHeadIds : 0
          }?startDate=${startDateISO}&endDate=${endDateISO}`
        )

        const fixedLiabilitiesResponse = await fetchDataFromApi(
          `/journals/fixedLiabilities/${
            fixedLiabilitiesHeadIds ? fixedLiabilitiesHeadIds : 0
          }?startDate=${startDateISO}&endDate=${endDateISO}`
        )

        const currentLiabilitiesResponse = await fetchDataFromApi(
          `/journals/currentLiabilities/${
            currentLiabilitiesHeadIds ? currentLiabilitiesHeadIds : 0
          }?startDate=${startDateISO}&endDate=${endDateISO}`
        )
        const equityResponse = await fetchDataFromApi(
          `/journals/equity/${equityHeadIds ? equityHeadIds : 0}?startDate=${startDateISO}&endDate=${endDateISO}`
        )

        console.log('currentLiabilitiesResponse:', currentLiabilitiesResponse)

        const fixedAsset = fixedAssetResponse.map((item, index) => ({
          id: `asset_${index}`,
          details: item.name,
          amount1: item.amount,
          amount2: null,
          isHeading: false
        }))

        const currentAsset = currentAssetResponse.map((item, index) => ({
          id: `asset_${index}`,
          details: item.name,
          amount1: item.amount,
          amount2: null,
          isHeading: false
        }))

        // Aggregate amounts for each unique detail in currentAsset
        const filterCurrentAsset = aggregateAmountsCurrentAsset(currentAsset, 'details')

        // Find the index of 'Accounts Receivable' and 'Cash Account' entries in the array
        const accountsReceivableIndex = filterCurrentAsset.findIndex(item => item.details === 'Accounts Receivable')
        const cashAccountIndex = filterCurrentAsset.findIndex(item => item.details === 'Cash Account')

        // If both 'Accounts Receivable' and 'Cash Account' entries exist, adjust the amount for 'Accounts Receivable'
        if (accountsReceivableIndex !== -1 && cashAccountIndex !== -1) {
          const accountsReceivableAmount = filterCurrentAsset[accountsReceivableIndex].amount1
          const cashAccountAmount = filterCurrentAsset[cashAccountIndex].amount1
          filterCurrentAsset[accountsReceivableIndex].amount1 = accountsReceivableAmount - cashAccountAmount
        }

        const fixedLiabilities = fixedLiabilitiesResponse.map((item, index) => ({
          id: `liabilities_${index}`,
          details: item.name,
          amount1: null,
          amount2: item.amount,
          isHeading: false
        }))

        const currentLiabilities = currentLiabilitiesResponse.map((item, index) => ({
          id: `liabilities_${index}`,
          details: item.name,
          amount1: null,
          amount2: item.amount,
          isHeading: false
        }))

        const filterCurrentLiabilities = aggregateAmountsCurrentLiabilities(currentLiabilities, 'details')

        console.log('filterCurrentLiabilities:', filterCurrentLiabilities)

        const equity = equityResponse.map((item, index) => ({
          id: `liabilities_${index}`,
          details: item.name,
          amount1: null,
          amount2: item.amount,
          isHeading: false
        }))

        const totalFixedAsset = fixedAsset.reduce((acc, cur) => acc + (cur.amount1 || 0), 0)
        const totalCurrentAsset = filterCurrentAsset.reduce((acc, cur) => acc + (cur.amount1 || 0), 0)
        const totalAsset = totalFixedAsset + totalCurrentAsset

        const totalFixedLiabilities = fixedLiabilities.reduce((acc, cur) => acc + (cur.amount2 || 0), 0)
        const totalCurrentLiabilities = currentLiabilities.reduce((acc, cur) => acc + (cur.amount2 || 0), 0)
        const totalEquity = equity.reduce((acc, cur) => acc + (cur.amount2 || 0), 0)
        const totalLiabilitiesEquity = totalFixedLiabilities + totalCurrentLiabilities + totalEquity

        setData([
          { id: 'asset_heading', details: 'Assets:', amount1: null, amount2: null, isHeading: true },
          { id: 'current_asset_heading', details: 'Current Assets:', amount1: null, amount2: null },
          ...filterCurrentAsset,
          { id: 'fixed_asset_heading', details: 'Fixed Assets:', amount1: null, amount2: null },
          ...fixedAsset,
          { id: 'totalAssets', details: 'Total Assets', amount1: null, amount2: null, total: totalAsset },
          {
            id: 'liabilities_equity_heading',
            details: `Liabilities & Ownwer's Equity:`,
            amount1: null,
            amount2: null,
            isHeading: true
          },
          {
            id: 'current_liabilities_heading',
            details: `Current Liabilities:`,
            amount1: null,
            amount2: null
          },
          ...filterCurrentLiabilities,
          {
            id: 'fixed_liabilities_heading',
            details: `Fixed Liabilities:`,
            amount1: null,
            amount2: null
          },
          ...fixedLiabilities,
          { id: 'equity_heading', details: `Ownwer's Equity:`, amount1: null, amount2: null },
          ...equity,
          {
            id: 'totalLiabilitiesEquity',
            details: `Total Liabilities & Owner's Equity`,
            amount1: null,
            amount2: null,
            total: totalLiabilitiesEquity
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
