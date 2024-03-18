// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'
import TableCell, { TableCellBaseProps } from '@mui/material/TableCell'

// ** Configs
// import themeConfig from 'src/configs/themeConfig'

// ** Types
import { SingleInvoiceType } from 'src/types/apps/invoiceTypes'

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

const PreviewCard = ({ data }: Props) => {
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
                  <svg width={40} fill='none' height={22} viewBox='0 0 268 150' xmlns='http://www.w3.org/2000/svg'>
                    <rect
                      rx='25.1443'
                      width='50.2886'
                      height='143.953'
                      fill={theme.palette.primary.main}
                      transform='matrix(-0.865206 0.501417 0.498585 0.866841 195.571 0)'
                    />
                    <rect
                      rx='25.1443'
                      width='50.2886'
                      height='143.953'
                      fillOpacity='0.4'
                      fill='url(#paint0_linear_7821_79167)'
                      transform='matrix(-0.865206 0.501417 0.498585 0.866841 196.084 0)'
                    />
                    <rect
                      rx='25.1443'
                      width='50.2886'
                      height='143.953'
                      fill={theme.palette.primary.main}
                      transform='matrix(0.865206 0.501417 -0.498585 0.866841 173.147 0)'
                    />
                    <rect
                      rx='25.1443'
                      width='50.2886'
                      height='143.953'
                      fill={theme.palette.primary.main}
                      transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
                    />
                    <rect
                      rx='25.1443'
                      width='50.2886'
                      height='143.953'
                      fillOpacity='0.4'
                      fill='url(#paint1_linear_7821_79167)'
                      transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
                    />
                    <rect
                      rx='25.1443'
                      width='50.2886'
                      height='143.953'
                      fill={theme.palette.primary.main}
                      transform='matrix(0.865206 0.501417 -0.498585 0.866841 71.7728 0)'
                    />
                    <defs>
                      <linearGradient
                        y1='0'
                        x1='25.1443'
                        x2='25.1443'
                        y2='143.953'
                        id='paint0_linear_7821_79167'
                        gradientUnits='userSpaceOnUse'
                      >
                        <stop />
                        <stop offset='1' stopOpacity='0' />
                      </linearGradient>
                      <linearGradient
                        y1='0'
                        x1='25.1443'
                        x2='25.1443'
                        y2='143.953'
                        id='paint1_linear_7821_79167'
                        gradientUnits='userSpaceOnUse'
                      >
                        <stop />
                        <stop offset='1' stopOpacity='0' />
                      </linearGradient>
                    </defs>
                  </svg>
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
                        <Typography variant='h6'>{`#${data.invoice.id}`}</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='body2'>Date Issued:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='body2'>{data.invoice.issuedDate}</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='body2'>Date Due:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='body2'>{data.invoice.dueDate}</Typography>
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
                {/* {data.invoice.name} */}
                Manager
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                {/* {data.invoice.company} */}
                SS Steel Limited
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                {/* {data.invoice.address} */}
                Plot-4,Block-b, Tongi, Gazipur, Bangladesh
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                {data.invoice.contact}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                {/* {data.invoice.companyEmail} */}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: ['flex-start', 'flex-end'] }}>
              <div>
                <Typography variant='subtitle2' sx={{ mb: 3, color: 'text.primary', letterSpacing: '.1px' }}>
                  Subject:
                </Typography>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant='subtitle2'>Chittagong Port To S.S Steel</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant='body2'>Carrying Bill No:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography variant='body2'>TFL2014/2024</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant='body2'>B/L NO:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography variant='body2'>SGS2070UTY78, MEDUDO8905T</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant='body2'>L/C NO:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography variant='body2'>2356789005674, 209893304749</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary', letterSpacing: '.1px' }}>
                            Remarks:
                          </Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography variant='body2'>Charge 3000/- will be added for overweight</Typography>
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

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vehical No</TableCell>
                <TableCell>Container Number</TableCell>
                <TableCell>Rent</TableCell>
                <TableCell>Overweight</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>CMDA81-4372</TableCell>
                <TableCell>FCUI-389098</TableCell>
                <TableCell>40,000</TableCell>
                <TableCell>3000</TableCell>
                <TableCell>43000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>CMDA81-4372</TableCell>
                <TableCell>FCUI-389098</TableCell>
                <TableCell>40,000</TableCell>
                <TableCell>3000</TableCell>
                <TableCell>43000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>CMDA81-4372</TableCell>
                <TableCell>FCUI-389098</TableCell>
                <TableCell>40,000</TableCell>
                <TableCell>3000</TableCell>
                <TableCell>43000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>CMDA81-4372</TableCell>
                <TableCell>FCUI-389098</TableCell>
                <TableCell>40,000</TableCell>
                <TableCell>3000</TableCell>
                <TableCell>43000</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <CardContent sx={{ pt: 8 }}>
          <Grid container>
            <Grid item xs={12} sm={7} lg={9} sx={{ order: { sm: 1, xs: 2 } }}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant='body2'
                  sx={{ mr: 2, color: 'text.primary', fontWeight: 600, letterSpacing: '.25px' }}
                >
                  In Word:
                </Typography>
                <Typography variant='body2'>One Lakh seventy thousand taka only</Typography>
              </Box>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant='body2'
                  sx={{ mr: 2, color: 'text.primary', fontWeight: 600, letterSpacing: '.25px' }}
                >
                  Account Name:
                </Typography>
                <Typography variant='body2'>Top 4 Logistics, A/C No: 123456789, UCB, Kawranbazar branch</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={5} lg={3} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
              <CalcWrapper>
                <Typography variant='body2'>Subtotal:</Typography>
                <Typography variant='body2' sx={{ color: 'text.primary', letterSpacing: '.25px', fontWeight: 600 }}>
                  172000
                </Typography>
              </CalcWrapper>
              <CalcWrapper>
                <Typography variant='body2'>Discount:</Typography>
                <Typography variant='body2' sx={{ color: 'text.primary', letterSpacing: '.25px', fontWeight: 600 }}>
                  2000
                </Typography>
              </CalcWrapper>
              {/* <CalcWrapper>
                <Typography variant='body2'>Tax:</Typography>
                <Typography variant='body2' sx={{ color: 'text.primary', letterSpacing: '.25px', fontWeight: 600 }}>
                  21%
                </Typography>
              </CalcWrapper> */}
              <Divider
                sx={{ mt: theme => `${theme.spacing(5)} !important`, mb: theme => `${theme.spacing(3)} !important` }}
              />
              <CalcWrapper>
                <Typography variant='body2'>Total:</Typography>
                <Typography variant='body2' sx={{ color: 'text.primary', letterSpacing: '.25px', fontWeight: 600 }}>
                  170000
                </Typography>
              </CalcWrapper>
            </Grid>
          </Grid>
        </CardContent>

        <Divider sx={{ mt: theme => `${theme.spacing(4.5)} !important`, mb: '0 !important' }} />

        <CardContent>
          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
            <strong>Note:</strong> It was a pleasure working with you and your team. We hope you will keep us in mind
            for future freelance projects. Thank You!
          </Typography>
        </CardContent>
      </Card>
    )
  } else {
    return null
  }
}

export default PreviewCard
