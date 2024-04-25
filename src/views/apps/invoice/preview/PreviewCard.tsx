// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { TableCellBaseProps } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import Image from 'next/image'

// ** Configs
// import themeConfig from 'src/configs/themeConfig'

// ** Types
import { SingleInvoiceType } from 'src/types/apps/invoiceTypes'
import { formatDate } from 'src/utils/dateUtils'

interface Props {
  data: SingleInvoiceType
}

const MUITableCell = styled(TableCell)<TableCellBaseProps>(({ theme }) => ({
  borderBottom: 0,
  padding: `${theme.spacing(1, 0)} !important`
}))

const CalcWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const PreviewCard = ({ data, invoiceDetailsData }: any) => {
  // ** Hook
  const theme = useTheme()

  if (data) {
    return (
      <Card>
        <CardContent>
          <Grid container>
            <Grid item sm={6} xs={12} sx={{ mb: { sm: 0, xs: 4 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                  <Image src='/images/output.png' alt='Top-4 Logistics Logo' height={100} width={100} />
                  <Typography variant='h6' sx={{ ml: 2, fontWeight: 700, lineHeight: 1.2 }}>
                    Top-4 Logistics
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='body2' sx={{ mb: 1 }}>
                    9/31, F, Eastern Plaza, Hatirpul
                  </Typography>
                  <Typography variant='body2' sx={{ mb: 1 }}>
                    Dhaka - 1205, Bangladesh
                  </Typography>
                  <Typography variant='body2'>+8801852244141</Typography>
                  <Typography variant='body2'>top4we@gmail.com</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                <Table sx={{ maxWidth: '200px' }}>
                  <TableBody>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='h6'>Invoice</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='h6'>{`#${data.attributes.invoice_no}`}</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='body2'>Date Issued:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='body2'>{formatDate(data.attributes.date, 'DD-MM-YYYY')}</Typography>
                      </MUITableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <Divider
          sx={{ mt: theme => `${theme.spacing(6.5)} !important`, mb: theme => `${theme.spacing(5.5)} !important` }}
        />

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

        <Divider sx={{ mt: theme => `${theme.spacing(6.5)} !important`, mb: '0 !important' }} />

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
                  Joyes Eleyas
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

        <Divider sx={{ mt: theme => `${theme.spacing(4.5)} !important`, mb: '0 !important' }} />
      </Card>
    )
  } else {
    return null
  }
}

export default PreviewCard
