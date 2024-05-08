import React, { useEffect, useState } from 'react'
import { Card, Grid, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import TableHeader from 'src/views/apps/reports/income-statement/TableHeader' // Verify this path is correct
import { fetchDataFromApi } from 'src/utils/api' // Ensure this utility handles API calls properly

const BalanceSheet = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const revenueHeadResponse = await fetchDataFromApi(
          `/individual-accounts?populate=*&filters[short_name][$eq]=ar`
        )

        const expenseHeadResponse = await fetchDataFromApi(
          `/individual-accounts?populate=id&filters[account][id][$eq]=5`
        )

        const revenueHeadIds = revenueHeadResponse.data.map((item: { id: any }) => item.id).join(',')
        const expenseHeadIds = expenseHeadResponse.data.map((item: { id: any }) => item.id).join(',')

        const revenuesResponse = await fetchDataFromApi(`/journals/revenue/${revenueHeadIds}`)

        const expensesResponse = await fetchDataFromApi(`/journals/expense/${expenseHeadIds}`)

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
          { id: 'asset_heading', details: 'Assets', amount1: null, amount2: null, isHeading: true },
          { id: 'current_asset_heading', details: 'Current Assets:', amount1: null, amount2: null, isHeading: true },
          { id: 'fixed_asset_heading', details: 'Fixed Assets:', amount1: null, amount2: null, isHeading: true },
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
            details: `Current Liabilities:`,
            amount1: null,
            amount2: null,
            isHeading: true
          },
          {
            id: 'fixed_liabilities_heading',
            details: `Fixed Liabilities:`,
            amount1: null,
            amount2: null,
            isHeading: true
          },
          { id: 'equity_heading', details: `Ownwer's Equity:`, amount1: null, amount2: null, isHeading: true },
          ...expenses,
          { id: 'totalExpenses', details: 'Total Expenses', amount1: null, amount2: null, total: `${totalExpenses}` },
          {
            id: 'Net Income',
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
    { field: 'amount1', headerName: 'Asset (Tk.)', flex: 1, type: 'number', align: 'right', headerAlign: 'right' },
    {
      field: 'amount2',
      headerName: 'Liabilities & equity (Tk.)',
      flex: 1,
      type: 'number',
      align: 'right',
      headerAlign: 'right'
    },
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
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Typography variant='h6' component='div' sx={{ p: 2, textAlign: 'center' }}>
            Balance Sheet
          </Typography>
          <TableHeader selectedRows={[]} />
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
        </Card>
      </Grid>
    </Grid>
  )
}

export default BalanceSheet
