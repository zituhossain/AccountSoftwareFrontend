// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { GridRowId } from '@mui/x-data-grid'

interface TableHeaderProps {
  value: string
  selectedRows: GridRowId[]
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, handleFilter } = props

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          value={value}
          placeholder='Search By Type'
          sx={{ mr: 4, mb: 2, maxWidth: '200px' }}
          onChange={e => handleFilter(e.target.value)}
        />
        <Button sx={{ mb: 2 }} component={Link} variant='contained' href='/apps/company/business-relation/add'>
          Create Business Relation
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
