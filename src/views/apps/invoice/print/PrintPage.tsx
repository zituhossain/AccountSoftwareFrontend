// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Alert from '@mui/material/Alert'
import Box, { BoxProps } from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { TableCellBaseProps } from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import { formatDate } from 'src/utils/dateUtils'

// ** Configs
import { CardContent, TableContainer } from '@mui/material'

const CalcWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const MUITableCell = styled(TableCell)<TableCellBaseProps>(({ theme }) => ({
  borderBottom: 0,
  padding: `${theme.spacing(1, 0)} !important`
}))

const InvoicePrint = ({ invoiceMasterData, invoiceDetailsData }: any) => {
  // ** State
  const [error, setError] = useState<boolean>(false)
  const [data, setData] = useState<null | any>(null)

  useEffect(() => {
    setTimeout(() => {
      window.print()
    }, 100)
  }, [])

  useEffect(() => {
    if (invoiceMasterData) {
      setData(invoiceMasterData)
      setError(false)
    } else {
      setData(null)
      setError(true)
    }
  }, [invoiceMasterData])

  if (data) {
    // const { invoice, paymentDetails } = data

    return (
      <Box sx={{ p: 12, pb: 6 }}>
        <Grid container>
          <Grid item xs={8} sx={{ mb: { sm: 0, xs: 4 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                <Image src='/images/output.png' alt='Top-4 Logistics Logo' height={100} width={100} />

                <Typography variant='h6' sx={{ ml: 2, fontWeight: 700, lineHeight: 1.2 }}>
                  Top-4 Logistics
                </Typography>
              </Box>
              <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                <div>
                  <Typography variant='body2' sx={{ mb: 1 }}>
                    9/31, F, Eastern Plaza, Hatirpul
                  </Typography>
                  <Typography variant='body2' sx={{ mb: 1 }}>
                    Dhaka - 1205, Bangladesh
                  </Typography>
                  <Typography variant='body2'>+8801852244141</Typography>
                  <Typography variant='body2'>top4we@gmail.com</Typography>
                </div>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { sm: 'flex-end', xs: 'flex-start' } }}>
              <Typography variant='h6' sx={{ mb: 2 }}>
                {`Invoice #${data.attributes.invoice_no}`}
              </Typography>
              <Box sx={{ mb: 2, display: 'flex' }}>
                <Typography variant='body2' sx={{ mr: 3 }}>
                  Date Issued:
                </Typography>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {formatDate(data.attributes.date, 'DD-MM-YYYY')}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: theme => `${theme.spacing(6)} !important` }} />

        <CardContent>
          <Grid container>
            <Grid item xs={12} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
              <Typography variant='subtitle2' sx={{ mb: 3, color: 'text.primary', letterSpacing: '.1px' }}>
                Invoice To:
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                {data.attributes.client.data.attributes.name}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                {data.attributes.client.data.attributes.address}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                {data.attributes.client.data.attributes.email}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                {data.attributes.client.data.attributes.phone}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: ['flex-start', 'flex-end'] }}>
              <div>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant='body2'>Subject:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography variant='body2'>{data.attributes.subject}</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant='body2'>B/L NO:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography variant='body2'>{data.attributes.bl_number}</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant='body2'>L/C NO:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography variant='body2'>{data.attributes.lc_number}</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary', letterSpacing: '.1px' }}>
                            Remarks:
                          </Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography variant='body2'>{data.attributes.remarks}</Typography>
                        </MUITableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Grid>
          </Grid>
        </CardContent>

        <Divider sx={{ mt: theme => `${theme.spacing(6)} !important`, mb: '0 !important' }} />

        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='left'>Driver Name</TableCell>
                  <TableCell align='left'>Driver Phone</TableCell>
                  <TableCell align='left'>Vehicle No</TableCell>
                  <TableCell align='left'>Container No</TableCell>
                  <TableCell align='right'>Amount</TableCell>
                  <TableCell align='right'>Overweight</TableCell>
                </TableRow>
              </TableHead>
              {invoiceDetailsData ? (
                <TableBody>
                  {invoiceDetailsData.map((item: any) => (
                    <TableRow key={item.id}>
                      <MUITableCell align='left'>{item.attributes.driver_name}</MUITableCell>
                      <MUITableCell align='left'>{item.attributes.driver_phone}</MUITableCell>
                      <MUITableCell align='left'>{item.attributes.vehicle_number}</MUITableCell>
                      <MUITableCell align='left'>{item.attributes.container_number}</MUITableCell>
                      <MUITableCell align='right'>{item.attributes.rate}</MUITableCell>
                      <MUITableCell align='right'>{item.attributes.overweight}</MUITableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : null}
            </Table>
          </TableContainer>
        </CardContent>

        <Divider sx={{ mt: theme => `${theme.spacing(6.5)} !important`, mb: '0 !important' }} />
        <CardContent>
          <Grid container>
            <Grid item xs={12} sm={9} sx={{ order: { sm: 1, xs: 2 } }}>
              <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', height: '100px' }}>{/* Signature Image */}</Box>
              <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant='subtitle2'
                  sx={{ mr: 2, color: 'text.primary', fontWeight: 600, letterSpacing: '.25px' }}
                >
                  Thanking You
                </Typography>
              </Box>
              <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant='subtitle2'
                  sx={{ mr: 2, color: 'text.primary', fontWeight: 600, letterSpacing: '.25px' }}
                >
                  Joyes Ahmed
                </Typography>
              </Box>
              <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant='subtitle2'
                  sx={{ mr: 2, color: 'text.primary', fontWeight: 600, letterSpacing: '.25px' }}
                >
                  For: Top-4 Logistics
                </Typography>
              </Box>
              <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant='subtitle2'
                  sx={{ mr: 2, color: 'text.primary', fontWeight: 600, letterSpacing: '.25px' }}
                >
                  Cell: +8801852244141
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
              <CalcWrapper>
                <Typography variant='body2'>Subtotal:</Typography>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                  {data.attributes.total_amount}
                </Typography>
              </CalcWrapper>
              {/* <CalcWrapper>
              <Typography variant='body2'>Discount:</Typography>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                $28
              </Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant='body2'>Tax:</Typography>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                21%
              </Typography>
            </CalcWrapper>
            <Divider
              sx={{ mt: theme => `${theme.spacing(6)} !important`, mb: theme => `${theme.spacing(1.5)} !important` }}
            />
            <CalcWrapper>
              <Typography variant='body2'>Total:</Typography>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                $1690
              </Typography>
            </CalcWrapper> */}
            </Grid>
          </Grid>
        </CardContent>

        {/* <Divider sx={{ my: `${theme.spacing(6)} !important` }} />
        <Typography variant='body2'>
          <strong>Note:</strong> It was a pleasure working with you and your team. We hope you will keep us in mind for
          future freelance projects. Thank You!
        </Typography> */}
      </Box>
    )
  } else if (error) {
    return (
      <Box sx={{ p: 5 }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Alert severity='error'>
              Quotation with the id: {} does not exist. Please check the list of invoices:{' '}
              <Link href='/apps/quotation/list'>Quotation List</Link>
            </Alert>
          </Grid>
        </Grid>
      </Box>
    )
  } else {
    return null
  }
}

export default InvoicePrint
