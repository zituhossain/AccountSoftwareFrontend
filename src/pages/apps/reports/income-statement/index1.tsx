import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import TableHeader from 'src/views/apps/accounts/TableHeader'
import { DataGrid } from '@mui/x-data-grid'

// ** Custom Components Imports

// ** Vars
const staticIncomeStatementData = [
  {
    id: 'Service Revenue',
    details: 'Service Revenue',
    amountTk: 13620
  },
  {
    id: 'Add: Service provided but unbilled',
    details: 'Add: Service provided but unbilled',
    amountTk: 0
  },
  {
    id: 'Supplies Expense',
    details: 'Supplies Expense',
    amountTk: 1050
  },
  {
    id: 'Less: Supplies on hand at March 31, 2022',
    details: 'Less: Supplies on hand at March 31, 2022',
    amountTk: -750
  },
  {
    id: 'Insurance Expense (150×3)',
    details: 'Insurance Expense (150×3)',
    amountTk: 300
  },
  {
    id: 'Depreciation Expense',
    details: 'Depreciation Expense',
    amountTk: 0
  },
  {
    id: 'Salaries Expense',
    details: 'Salaries Expense',
    amountTk: 0
  },
  {
    id: 'Travel Expense',
    details: 'Travel Expense',
    amountTk: 2200
  },
  {
    id: 'Rent Expense',
    details: 'Rent Expense',
    amountTk: 1200
  },
  {
    id: 'Interest Expense',
    details: 'Interest Expense',
    amountTk: 0
  },
  {
    id: 'Miscellaneous Expense',
    details: 'Miscellaneous Expense',
    amountTk: 300
  },
  {
    id: 'Net Income',
    details: 'Net Income',
    amountTk: 7920
  }
]

const LinkStyled = styled('a')(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

const IncomeStatement = () => {
  // ** State
  const [value, setValue] = useState('')

  const handleFilter = (val: string) => {
    setValue(val)
  }

  useEffect(() => {
    // You can add any additional side effects here
  }, [])

  const columns = [
    { field: 'id', headerName: 'Details', width: 200 },
    { field: 'details', headerName: 'Amount (Tk.)', width: 150 },
    { field: 'amountTk', headerName: 'Amount (Tk.)', type: 'number', width: 150 }
  ]

  const rows = staticIncomeStatementData.map(item => ({
    ...item
  }))

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} handleFilter={handleFilter} selectedRows={[]} />
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default IncomeStatement
