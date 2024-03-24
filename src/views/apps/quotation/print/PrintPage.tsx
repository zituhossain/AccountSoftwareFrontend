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
import { styled, useTheme } from '@mui/material/styles'

// ** Types

// ** Third Party Components
import axios from 'axios'

// ** Configs
import themeConfig from 'src/configs/themeConfig'
import { CardContent } from '@mui/material'

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

const InvoicePrint = ({ quotationData }: any) => {
  // ** State
  const [error, setError] = useState<boolean>(false)
  const [data, setData] = useState<null | any>(null)

  console.log('data: from print id page', quotationData)
  console.log('error: from print id page', error)
  console.log('data: from print id page', data)

  // ** Hooks
  const theme = useTheme()

  useEffect(() => {
    setTimeout(() => {
      window.print()
    }, 100)
  }, [])

  useEffect(() => {
    if (quotationData) {
      setData(quotationData)
      setError(false)
    } else {
      setData(null)
      setError(true)
    }
  }, [quotationData])

  if (data) {
    // const { invoice, paymentDetails } = data

    return (
      <Box sx={{ p: 12, pb: 6 }}>
        <Grid container>
          <Grid item xs={8} sx={{ mb: { sm: 0, xs: 4 } }}>
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
                  {themeConfig.templateName}
                </Typography>
              </Box>
              <div>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  Office 149, 450 South Brand Brooklyn
                </Typography>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  San Diego County, CA 91905, USA
                </Typography>
                <Typography variant='body2'>+1 (123) 456 7891, +44 (876) 543 2198</Typography>
              </div>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { sm: 'flex-end', xs: 'flex-start' } }}>
              <Typography variant='h6' sx={{ mb: 2 }}>
                {`Invoice #${data.attributes.quotation_no}`}
              </Typography>
              <Box sx={{ mb: 2, display: 'flex' }}>
                <Typography variant='body2' sx={{ mr: 3 }}>
                  Date Issued:
                </Typography>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {data.attributes.date}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: theme => `${theme.spacing(6)} !important` }} />

        <Grid container>
          <Grid item xs={7} md={8} sx={{ mb: { lg: 0, xs: 4 } }}>
            <Typography variant='body2' sx={{ mb: 3.5, fontWeight: 600 }}>
              Quotation To:
            </Typography>
            <Typography variant='body2' sx={{ mb: 2 }}>
              {data.attributes.client.data.attributes.name}
            </Typography>
            <Typography variant='body2' sx={{ mb: 2 }}>
              {data.attributes.client.data.attributes.address}
            </Typography>
            <Typography variant='body2' sx={{ mb: 2 }}>
              {data.attributes.client.data.attributes.phone}
            </Typography>
            <Typography variant='body2' sx={{ mb: 2 }}>
              {data.attributes.client.data.attributes.email}
            </Typography>
          </Grid>
          <Grid item xs={5} md={4}>
            <Typography variant='body2' sx={{ mb: 3.5, fontWeight: 600 }}>
              Bill To:
            </Typography>
            {/* <Table>
              <TableBody>
                <TableRow>
                  <MUITableCell>Total Due:</MUITableCell>
                  <MUITableCell>{paymentDetails.totalDue}</MUITableCell>
                </TableRow>
                <TableRow>
                  <MUITableCell>Bank name:</MUITableCell>
                  <MUITableCell>{paymentDetails.bankName}</MUITableCell>
                </TableRow>
                <TableRow>
                  <MUITableCell>Country:</MUITableCell>
                  <MUITableCell>{paymentDetails.country}</MUITableCell>
                </TableRow>
                <TableRow>
                  <MUITableCell>IBAN:</MUITableCell>
                  <MUITableCell>{paymentDetails.iban}</MUITableCell>
                </TableRow>
                <TableRow>
                  <MUITableCell>SWIFT code:</MUITableCell>
                  <MUITableCell>{paymentDetails.swiftCode}</MUITableCell>
                </TableRow>
              </TableBody>
            </Table> */}
          </Grid>
        </Grid>

        <Divider sx={{ mt: theme => `${theme.spacing(6)} !important`, mb: '0 !important' }} />

        <Table sx={{ mb: 6 }}>
          <TableHead>
            <TableRow>
              <TableCell>Client Rate</TableCell>
              <TableCell>Our Rate</TableCell>
              <TableCell>No. of Items</TableCell>
              <TableCell>Overweight</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{data.attributes.client_rate}</TableCell>
              <TableCell>{data.attributes.our_rate}</TableCell>
              <TableCell>{data.attributes.no_of_items}</TableCell>
              <TableCell>{data.attributes.overweight}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

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
          </Grid>
        </CardContent>

        <Divider sx={{ my: `${theme.spacing(6)} !important` }} />
        <Typography variant='body2'>
          <strong>Note:</strong> It was a pleasure working with you and your team. We hope you will keep us in mind for
          future freelance projects. Thank You!
        </Typography>
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
