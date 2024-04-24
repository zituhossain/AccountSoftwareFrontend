// ** React Imports
import { useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
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
import { useRouter } from 'next/navigation'
import { ThemeColor } from 'src/@core/layouts/types'
import { deleteDataFromApi, fetchDataFromApi, postDataToApiAxios, putDataToApi } from 'src/utils/api'
import TableHeader from 'src/views/apps/quotation/TableHeader'
import ConfirmDialog from 'src/pages/reuseableComponent/deleteDialouge'
import toast from 'react-hot-toast'
import router from 'next/router'
import Box from '@mui/material/Box'

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
    client_rate: number
    our_rate: number
    no_of_items: number
    overweight: number
    lc_number: string
    bl_number: string
    remarks: string
    status: boolean
    createdAt: string
    updatedAt: string
    publishedAt: string
    client?: string
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

const Quotation = () => {
  // ** State
  const [quotation, setQuotation] = useState<Quotation[]>([])
  const [filteredQuotation, setFilteredQuotation] = useState<Quotation[]>([])
  const [value, setValue] = useState<string>('')

  const [deleteId, setDeleteId] = useState<string | number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  useEffect(() => {
    const filtered = quotation.filter(quot =>
      quot.attributes?.client?.data?.attributes?.name.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredQuotation(filtered)
  }, [value, quotation])

  useEffect(() => {
    // Fetch companies data from API
    const fetchQuotaiton = async () => {
      try {
        const response = await fetchDataFromApi('/quotations?populate=*')
        setQuotation(response.data)
        setFilteredQuotation(response.data)
      } catch (error) {
        console.error('Error fetching contact type:', error)
      }
    }
    fetchQuotaiton()
  }, [])

  const handleEdit = (id: string | number) => {
    // Find the contact type by id
    const selectedQuotation = quotation.find(item => item.id === id)
    if (selectedQuotation) {
      router.push(`/apps/quotation/add?id=${selectedQuotation.id}`)
    }
  }

  const toggleStatus = async (id: number) => {
    const targetQuotation = quotation.find(q => q.id === id)

    if (!targetQuotation.attributes.status) {
      // Only toggle if currently inactive
      const updatedQuotations = quotation.map(q => {
        if (q.id === id) {
          return { ...q, attributes: { ...q.attributes, status: true } } // Set status to active
        }

        return q
      })
      setQuotation(updatedQuotations)

      try {
        await putDataToApi(`/quotations/${id}`, {
          data: {
            status: true
          }
        })

        // Journal Data
        const userData = JSON.parse(localStorage.getItem('userData')!)
        const userResponse = await fetchDataFromApi(`/users/${userData.id}?populate=company`)
        const purchaseId = await fetchDataFromApi(`/individual-accounts?filters[short_name][$eq]=p`)
        const accountPayableId = await fetchDataFromApi(`/individual-accounts?filters[short_name][$eq]=ap`)

        const fetchQuotationDetails = async (quotationId: any) => {
          const response = await fetchDataFromApi(`/quotations/${quotationId}?populate=client`)
          const { client_rate } = response.data.attributes
          console.log('client', response.data.attributes?.client?.data?.id)
          const client = response.data.attributes?.client?.data?.id

          return {
            clientRate: client_rate,
            client
          }
        }

        const journalData = new FormData()

        const quotationInfo = await fetchQuotationDetails(id)

        journalData.append(
          'data',
          JSON.stringify({
            quotation: id,
            amount: quotationInfo.clientRate,
            credit_account: accountPayableId.data[0].id,
            debit_account: purchaseId.data[0].id,
            created_user: userData.id,
            company: userResponse.company.id,
            client: quotationInfo.client
          })
        )
        const journalResponse = await postDataToApiAxios('/journals', journalData)
        console.log('journalResponse:', journalResponse.data)
        toast.success('Quotation status updated successfully')
      } catch (error) {
        toast.error('Failed to update quotation status')
        console.error('Update Error:', error)
      }
    } else {
      toast.error('This quotation is already active and cannot be set to inactive.')
    }
  }
  const RowOptions = ({ id }: { id: number | string }) => {
    // ** Hooks
    const router = useRouter()

    const handleView = () => {
      router.push(`/apps/quotation/preview/${id}`)
    }

    const handleEditClick = (id: string | number) => {
      handleEdit(id)
    }

    return (
      <>
        <IconButton size='small' onClick={handleView}>
          <Icon icon='mdi:eye-outline' />
        </IconButton>
        <IconButton size='small' onClick={() => handleEditClick(id)}>
          <Icon icon='mdi:pencil-outline' />
        </IconButton>
        <IconButton size='small' onClick={() => handleDeleteClick(id)}>
          <Icon icon='mdi:delete-outline' />
        </IconButton>
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
      field: 'name',
      minWidth: 200,
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
      minWidth: 120,
      field: 'quotation_no',
      headerName: 'Quot No',
      renderCell: ({ row }: CellType) => (
        <LinkStyled href={`/companies/${row.id}`}>{row.attributes.quotation_no}</LinkStyled>
      )
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'client_rate',
      headerName: 'Client Rate',
      renderCell: ({ row }: CellType) => (
        <Typography noWrap variant='body2'>
          {row.attributes.client_rate}
        </Typography>
      )
    },
    {
      flex: 0.15,
      field: 'our_rate',
      minWidth: 150,
      headerName: 'Our Rate',
      renderCell: ({ row }: CellType) => (
        <Typography noWrap variant='body2'>
          {row.attributes.our_rate}
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'No of Items',
      field: 'no_of_items',
      renderCell: ({ row }: CellType) => (
        <Typography variant='subtitle1' noWrap>
          {row.attributes.no_of_items}
        </Typography>
      )
    },
    {
      flex: 0.1,
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
      minWidth: 150,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => (
        <CustomChip
          skin='light'
          size='small'
          label={row.attributes.status ? 'Confirmed' : 'Not Confirmed'}
          color={companyStatusObj[row.attributes.status]}
          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          onClick={() => {
            if (!row.attributes.status) {
              // Only allow clicking if inactive
              toggleStatus(row.id)
            }
          }}
          style={{ cursor: row.attributes.status ? 'default' : 'pointer' }}
        />
      )
    },
    {
      flex: 0.15,
      minWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => <RowOptions id={row.id} />
    }
  ]

  const handleDeleteConfirm = async () => {
    if (deleteId !== null) {
      try {
        await deleteDataFromApi(`/quotations/${deleteId}`)
        setQuotation(quotation.filter(item => item.id !== deleteId))
        setDialogOpen(false)
        toast.success('Quotation deleted successfully')
      } catch (error) {
        console.error('Error deleting Quotation:', error)
        toast.error('Failed to delete Quotation')
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
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Quotation List' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <CardContent>
            <TableHeader value={value} handleFilter={handleFilter} selectedRows={[]} />
            <DataGrid
              autoHeight
              rows={filteredQuotation}
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
        message='Are you sure you want to delete this quotations?'
      />
    </Grid>
  )
}

export default Quotation
