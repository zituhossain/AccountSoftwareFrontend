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
  quotationData: any
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

const QuotationList = ({ quotationData }: Props) => {
  // ** State
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })

  // const [invoiceDetails, setInvoiceDetails] = useState([])

  // useEffect(() => {
  //   const invoices = quotationData.map((quotation: any, index: number) => ({
  //     ...quotation,
  //     slNo: index + 1
  //   }))
  //   setInvoiceDetails(invoices)
  // }, [quotationData])

  console.log('quotationData Table', quotationData)

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
      minWidth: 50,
      field: 'quotation_no',
      headerName: 'Qou No.',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.attributes.quotation_no || 0}</Typography>
    },
    {
      flex: 0.25,
      minWidth: 100,
      field: 'date',
      headerName: 'Date',
      renderCell: ({ row }: CellType) => (
        <Typography variant='body2'>
          {formatDate(row.attributes.invoice_master.data.attributes.date, 'DD-MM-YYYY')}
        </Typography>
      )
    }

    // {
    //   flex: 0.25,
    //   minWidth: 50,
    //   field: 'driver_name',
    //   headerName: 'Driver Name',
    //   renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.attributes?.driver_name || null}</Typography>
    // },
    // {
    //   flex: 0.25,
    //   minWidth: 50,
    //   field: 'vehicle_number',
    //   headerName: 'Vehicle No.',
    //   renderCell: ({ row }: CellType) => (
    //     <Typography variant='body2'>{row.attributes?.vehicle_number || null}</Typography>
    //   )
    // },
    // {
    //   flex: 0.25,
    //   minWidth: 50,
    //   field: 'container_number',
    //   headerName: 'Container No.',
    //   renderCell: ({ row }: CellType) => (
    //     <Typography variant='body2'>{row.attributes?.container_number || null}</Typography>
    //   )
    // },
    // {
    //   flex: 0.25,
    //   minWidth: 50,
    //   field: 'rate',
    //   headerName: 'Rate',
    //   renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.attributes?.rate || 0}</Typography>
    // },
    // {
    //   flex: 0.25,
    //   minWidth: 50,
    //   field: 'overweight',
    //   headerName: 'Overweight',
    //   renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.attributes?.overweight || 0}</Typography>
    // }
  ]

  return (
    <>
      <Card>
        {/* <CardHeader title='Invoice List' sx={{ '& .MuiCardHeader-action': { m: 0 } }} /> */}
        <DataGrid
          autoHeight
          columns={columns}
          rows={quotationData}
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

export default QuotationList
