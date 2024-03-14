// ** React Imports
import { useState, MouseEvent, useCallback } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import Link from 'next/link'
import { GetStaticProps } from 'next/types'
import CustomChip from 'src/@core/components/mui/chip'

// ** Third Party Components

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { Menu } from '@mui/material'
import { deleteUser } from 'src/store/apps/user'
import TableHeader from 'src/views/apps/quotation/TableHeader'
import { fetchDataFromApi } from 'src/utils/api'

// ** Vars
const companyStatusObj: { [key: string]: ThemeColor } = {
  true: 'success',
  false: 'secondary'
}

interface Quotation {
  id: number
  attributes: {
    quotation_no: string
    subject: string
    supplier_rate: number
    top4_rate: number
    no_of_trailers: number
    overweight: number
    lc_number: string
    bl_number: string
    remarks: string
    status: boolean
    supplier_id: number
    createdAt: string
    updatedAt: string
    publishedAt: string
    avatar: string
    avatarColor?: ThemeColor
  }
}

interface CellType {
  row: Quotation
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

const RowOptions = ({ id }: { id: number | string }) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    dispatch(deleteUser(id))
    handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='mdi:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          onClick={handleRowOptionsClose}
          href='/apps/user/view/overview/'
        >
          <Icon icon='mdi:eye-outline' fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

const columns: GridColDef[] = [
  {
    flex: 0.2,
    minWidth: 230,
    field: 'quotation_no',
    headerName: 'Quotation No',
    renderCell: ({ row }: CellType) => (
      <LinkStyled href={`/companies/${row.id}`}>{row.attributes.quotation_no}</LinkStyled>
    )
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: 'supplier_rate',
    headerName: 'Supplier Rate',
    renderCell: ({ row }: CellType) => (
      <Typography noWrap variant='body2'>
        {row.attributes.supplier_rate}
      </Typography>
    )
  },
  {
    flex: 0.15,
    field: 'top4_rate',
    minWidth: 150,
    headerName: 'Top4 Rate',
    renderCell: ({ row }: CellType) => (
      <Typography noWrap variant='body2'>
        {row.attributes.top4_rate}
      </Typography>
    )
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'No of Trailers',
    field: 'no_of_trailers',
    renderCell: ({ row }: CellType) => (
      <Typography variant='subtitle1' noWrap>
        {row.attributes.no_of_trailers}
      </Typography>
    )
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Overweight',
    field: 'overweight',
    renderCell: ({ row }: CellType) => (
      <Typography variant='subtitle1' noWrap>
        {row.attributes.overweight}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => (
      <CustomChip
        skin='light'
        size='small'
        label={row.attributes.status ? 'Active' : 'Inactive'}
        color={companyStatusObj[row.attributes.status]}
        sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
      />
    )
  },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => <RowOptions id={row.id} />
  }
]

const Quotation = ({ quotationData }: { quotationData: Quotation[] }) => {
  // ** State
  const [value, setValue] = useState<string>('')

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Quotation List' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <CardContent>
            <TableHeader value={value} handleFilter={handleFilter} selectedRows={[]} />
            <DataGrid
              autoHeight
              rows={quotationData}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const quotationData = await fetchDataFromApi('/api/quotations')

    console.log('mydata', quotationData.data)

    return {
      props: {
        quotationData: quotationData.data
      },
      revalidate: 60 // Optional: This will re-generate the page every 60 seconds
    }
  } catch (error) {
    console.error('Error fetching data:', error)

    return {
      props: {
        quotationData: []
      }
    }
  }
}

export default Quotation
