// ** React Imports
import { useEffect, useState } from 'react'

import { formatDate } from 'src/utils/dateUtils'

// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports

// ** Type Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Component Imports

interface Props {
  transactionData: any
}

interface InvoiceStatusObj {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
}
interface CellType {
  row: any
}

const InvoiceList = ({ transactionData }: Props) => {
  // ** State
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const [invoiceDetails, setInvoiceDetails] = useState([])

  useEffect(() => {
    const invoices = transactionData.map((invoice: any, index: number) => ({
      ...invoice,
      slNo: index + 1
    }))
    setInvoiceDetails(invoices)
  }, [transactionData])

  const columns: GridColDef[] = [
    // {
    //   sortable: true,
    //   field: 'slNo',
    //   headerName: '#',
    //   flex: 0,
    //   editable: false,
    //   renderCell: params => params.api.getAllRowIds().indexOf(params.id) + 1
    // },
    {
      flex: 0.25,
      minWidth: 90,
      field: 'invoice_no',
      headerName: 'Inv No.',
      renderCell: ({ row }: CellType) => (
        <Typography variant='body2'>{row.attributes?.invoice_id?.data?.attributes?.invoice_no || 0}</Typography>
      )
    },
    {
      flex: 0.35,
      minWidth: 150,
      field: 'date',
      headerName: 'Date',
      renderCell: ({ row }: CellType) => (
        <Typography variant='body2'>{formatDate(row.attributes?.createdAt, 'DD-MM-YYYY')}</Typography>
      )
    },
    {
      flex: 0.25,
      minWidth: 90,
      field: 'payment_option',
      headerName: 'Payment By',
      renderCell: ({ row }: CellType) => (
        <Typography variant='body2'>
          {row.attributes.payment_option == 0 ? 'Cash' : row.attributes.payment_option == 1 ? 'Check' : 'MFS'}
        </Typography>
      )
    },
    {
      flex: 0.25,
      minWidth: 90,
      field: 'total_amount',
      headerName: 'Total',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.attributes?.total_amount || null}</Typography>
    },
    {
      flex: 0.25,
      minWidth: 90,
      field: 'paid_amount',
      headerName: 'Paid',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.attributes?.paid_amount || null}</Typography>
    },
    {
      flex: 0.25,
      minWidth: 90,
      field: 'due_amount',
      headerName: 'Due',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.attributes?.due_amount || null}</Typography>
    }
  ]

  return (
    <>
      <Card>
        {/* <CardHeader title='Invoice List' sx={{ '& .MuiCardHeader-action': { m: 0 } }} /> */}
        <DataGrid
          autoHeight
          columns={columns}
          rows={invoiceDetails}
          disableRowSelectionOnClick
          pageSizeOptions={[7, 10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
        />
      </Card>
    </>
  )
}

export default InvoiceList
