import React, { useEffect, useState } from 'react'
import { Card, Grid, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import TableHeader from 'src/views/apps/accounts/TableHeader' // Verify this path is correct
import { fetchDataFromApi } from 'src/utils/api' // Ensure this utility handles API calls properly

const IncomeStatement = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const revenuesResponse = await fetchDataFromApi('/revenues?populate=*')
        const expensesResponse = await fetchDataFromApi('/expenses?populate=*')

        const revenues = revenuesResponse.data.map((item, index) => ({
          id: `revenue_${index}`,
          details: item.attributes.title,
          amount1: null,
          amount2: item.attributes.amount,
          isHeading: false
        }))

        const expenses = expensesResponse.data.map((item, index) => ({
          id: `expense_${index}`,
          details: item.attributes.title,
          amount1: item.attributes.amount,
          amount2: null,
          isHeading: false
        }))

        const totalRevenue = revenues.reduce((acc, cur) => acc + (cur.amount2 || 0), 0)
        const totalExpenses = expenses.reduce((acc, cur) => acc + (cur.amount1 || 0), 0)
        const netIncome = totalRevenue - totalExpenses

        setData([
          { id: 'revenue_heading', details: 'Revenues:', amount1: null, amount2: null, isHeading: true },
          ...revenues,
          { id: 'expense_heading', details: 'Expenses:', amount1: null, amount2: null, isHeading: true },
          ...expenses,
          { id: 'totalRevenue', details: 'Total Revenues', amount1: null, amount2: null, total: totalRevenue },
          { id: 'totalExpenses', details: 'Total Expenses', amount1: null, amount2: null, total: `(${totalExpenses})` },
          { id: 'Net Income', details: 'Net Income', amount1: null, amount2: null, total: netIncome }
        ])
      } catch (error) {
        console.error('Error fetching data:', error)

        // Handle errors appropriately (e.g., show error message to user)
      }
    }

    fetchData()
  }, [])

  const columns: GridColDef[] = [
    { field: 'details', headerName: 'Details', width: 250 },
    { field: 'amount1', headerName: 'Expense (Tk.)', width: 130, type: 'number', align: 'right', headerAlign: 'right' },
    { field: 'amount2', headerName: 'Revenue (Tk.)', width: 130, type: 'number', align: 'right', headerAlign: 'right' },
    { field: 'total', headerName: 'Total (Tk.)', width: 130, type: 'number', align: 'right', headerAlign: 'right' }
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
          <Typography variant='h6' component='div' sx={{ p: 2 }}>
            Income Statement
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

export default IncomeStatement
