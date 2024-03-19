// ** React Imports
import { MouseEvent, useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import Link from 'next/link'
import CustomChip from 'src/@core/components/mui/chip'

// ** Third Party Components

// ** Types Imports
import { Menu } from '@mui/material'
import { useDispatch } from 'react-redux'
import { ThemeColor } from 'src/@core/layouts/types'
import { AppDispatch } from 'src/store'
import { deleteUser } from 'src/store/apps/user'
import { fetchDataFromApi } from 'src/utils/api'
import TableHeader from 'src/views/apps/company/business-relation/TableHeader'

// ** Vars
const companyStatusObj: { [key: string]: ThemeColor } = {
  true: 'success',
  false: 'secondary'
}

interface BusinessRelation {
  id: number
  attributes: {
    company: {
      data: {
        attributes: {
          name: string
          code: string
          address: string
          email: string
          phone: string
          image: string
          createdAt: string
          updatedAt: string
          publishedAt: string
        }
      }
    }
    client: {
      data: {
        attributes: {
          name: string
          code: string
          address: string
          email: string
          phone: string
          image: string
          createdAt: string
          updatedAt: string
          publishedAt: string
        }
      }
    }
    relation_type: {
      data: {
        attributes: {
          title: string
          status: boolean
          createdAt: string
          updatedAt: string
          publishedAt: string
        }
      }
    }
    created_user: number
    status: boolean
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

interface CellType {
  row: BusinessRelation
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
    sortable: true,
    field: 'slNo',
    headerName: '#',
    flex: 0,
    editable: false,
    renderCell: params => params.api.getAllRowIds().indexOf(params.id) + 1
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'client',
    headerName: 'Business Contact',
    renderCell: ({ row }: CellType) => (
      <LinkStyled href={`/companies/${row.id}`}>{row.attributes?.client?.data?.attributes?.name}</LinkStyled>
    )
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: 'relation_type',
    headerName: 'Type',
    renderCell: ({ row }: CellType) => (
      <Typography noWrap variant='body2'>
        {row.attributes?.relation_type?.data?.attributes?.title}
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
        label={row.attributes?.status ? 'Active' : 'Inactive'}
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

const BusinessRelationList = () => {
  // ** State
  const [businessRelation, setBusinessRelation] = useState<BusinessRelation[]>([])
  const [value, setValue] = useState<string>('')

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  useEffect(() => {
    // Fetch companies data from API
    const fetchB2B = async () => {
      try {
        const response = await fetchDataFromApi('/b2b-relations?populate=*')
        console.log('zitu', response.data)
        setBusinessRelation(response.data)
      } catch (error) {
        console.error('Error fetching companies:', error)
      }
    }
    fetchB2B()
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Business Relation List'
            sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
          />
          <CardContent>
            <TableHeader value={value} handleFilter={handleFilter} selectedRows={[]} />
            <DataGrid
              autoHeight
              rows={businessRelation}
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

// export const getStaticProps: GetStaticProps = async () => {
//   try {
//     const b2bRelationData = await fetchDataFromApi('/b2b-relations?populate=*')

//     console.log('mydata', b2bRelationData.data)

//     return {
//       props: {
//         b2bRelationData: b2bRelationData.data
//       },
//       revalidate: 60 // Optional: This will re-generate the page every 60 seconds
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error)

//     return {
//       props: {
//         b2bRelationData: []
//       }
//     }
//   }
// }

export default BusinessRelationList
