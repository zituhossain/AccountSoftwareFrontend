// ** React Imports
import { ForwardedRef, forwardRef, useEffect, useState } from 'react'

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent, { CardContentProps } from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import Grid, { GridProps } from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { TableCellBaseProps } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { alpha, styled } from '@mui/material/styles'

// ** Icon Imports

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Configs

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Custom Component Imports
import { Controller } from 'react-hook-form'
import Repeater from 'src/@core/components/repeater'

interface PickerProps {
  label?: string
}

interface Props {
  toggleAddCustomerDrawer: () => void
  invoiceNumber: number
  clients: any
  selectedClient: any
  setSelectedClient: (val: any) => void
  setFormData: any
  formData: any
  control: any
  errors: any
  initialData: any
}

const CustomInput = forwardRef(({ ...props }: PickerProps, ref: ForwardedRef<HTMLElement>) => {
  return (
    <TextField
      size='small'
      inputRef={ref}
      sx={{ width: { sm: '250px', xs: '170px' }, '& .MuiInputBase-input': { color: 'text.secondary' } }}
      {...props}
    />
  )
})

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

const RepeatingContent = styled(Grid)<GridProps>(({ theme }) => ({
  paddingRight: 0,
  display: 'flex',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '& .col-title': {
    top: '-1.5rem',
    position: 'absolute'
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.secondary
  },
  [theme.breakpoints.down('lg')]: {
    '& .col-title': {
      top: '0',
      position: 'relative'
    }
  }
}))

const RepeaterWrapper = styled(CardContent)<CardContentProps>(({ theme }) => ({
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(5.5),
  '& .repeater-wrapper + .repeater-wrapper': {
    marginTop: theme.spacing(12)
  }
}))

const InvoiceAction = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: theme.spacing(2, 1),
  borderLeft: `1px solid ${theme.palette.divider}`
}))

const CustomSelectItem = styled(MenuItem)<MenuItemProps>(({ theme }) => ({
  color: theme.palette.success.main,
  backgroundColor: 'transparent !important',
  '&:hover': { backgroundColor: `${alpha(theme.palette.success.main, 0.1)} !important` }
}))

const now = new Date()
const tomorrowDate = now.setDate(now.getDate() + 7)

const AddCard = (props: Props) => {
  // ** Props
  const {
    clients,
    invoiceNumber,
    selectedClient,
    setSelectedClient,
    setFormData,
    formData,
    control,
    errors,
    initialData
  } = props

  // ** States
  const [count, setCount] = useState<number>(1)
  const [selected, setSelected] = useState<string>('')
  const [issueDate, setIssueDate] = useState<DateType>(new Date())

  // ** Handle Invoice To Change
  // const handleQuotationChange = (event: SelectChangeEvent) => {
  //   setSelected(event.target.value)
  //   if (clients !== undefined) {
  //     setSelectedClient(clients.filter(i => i.id === event.target.value)[0])
  //     setFormData({ ...formData, client: event.target.value })
  //   }
  // }

  // Update formData whenever date picker changes

  // React to changes in initialData to initialize the selected client
  useEffect(() => {
    // Check if initialData contains a client ID and clients are loaded
    if (initialData && initialData.client && initialData.client.data && clients) {
      const initialClientId = initialData.client.data.id

      const client = clients.find(c => c.id === initialClientId)

      if (client) {
        setSelectedClient(client)
        setSelected(initialClientId)

        // Update formData with the initial client ID
        setFormData((prevFormData: any) => ({ ...prevFormData, client: initialData.client }))
      }
    }
  }, [initialData, clients, setFormData])

  // Handler for when a new client is selected from the dropdown
  const handleQuotationChange = (event: SelectChangeEvent) => {
    const newSelectedId = event.target.value
    setSelected(newSelectedId)
    const newSelectedClient = clients.find(c => c.id === newSelectedId)
    if (newSelectedClient) {
      setSelectedClient(newSelectedClient)

      // Update the formData state in the parent component
      setFormData({ ...formData, client: newSelectedId })
    }
  }

  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid item xl={6} xs={12} sx={{ mb: { xl: 0, xs: 4 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
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
          <Grid item xl={6} xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xl: 'flex-end', xs: 'flex-start' } }}>
              <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <Typography variant='h6' sx={{ mr: 1, width: '105px' }}>
                  Quotation
                </Typography>
                <TextField
                  size='small'
                  value={invoiceNumber}
                  sx={{ width: { sm: '250px', xs: '170px' } }}
                  InputProps={{
                    disabled: true,
                    startAdornment: <InputAdornment position='start'>#</InputAdornment>
                  }}
                />
              </Box>
              <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <Typography variant='body2' sx={{ mr: 2, width: '100px' }}>
                  Date Issued:
                </Typography>
                <Controller
                  name='date'
                  control={control}
                  defaultValue={initialData?.date || new Date()} // Adjust the default value as needed
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={date => field.onChange(date)}
                      customInput={<CustomInput />}
                    />
                  )}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ my: theme => `${theme.spacing(1)} !important` }} />

      <CardContent sx={{ pb: 2 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
            <Typography variant='subtitle2' sx={{ mb: 3, color: 'text.primary' }}>
              Quotation To:
            </Typography>
            <Select size='small' value={selected} onChange={handleQuotationChange} sx={{ mb: 4, width: '200px' }}>
              {/* <MenuItem value={0}>Select Client</MenuItem> */}
              {clients !== undefined &&
                clients.map(client => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.attributes.name}
                  </MenuItem>
                ))}
            </Select>
            {selectedClient !== null && selectedClient !== undefined ? (
              <div>
                <Typography variant='body2' sx={{ mb: 1, color: 'text.primary' }}>
                  {selectedClient.attributes.name}
                </Typography>
                <Typography variant='body2' sx={{ mb: 1, color: 'text.primary' }}>
                  {selectedClient.attributes.address}
                </Typography>
                <Typography variant='body2' sx={{ mb: 1, color: 'text.primary' }}>
                  {selectedClient.attributes.phone}
                </Typography>
                <Typography variant='body2' sx={{ mb: 1, color: 'text.primary' }}>
                  {selectedClient.attributes.email}
                </Typography>
              </div>
            ) : null}
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: ['flex-start', 'flex-end'] }}>
            <div>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='subtitle2' sx={{ color: 'text.primary', letterSpacing: '.1px' }}>
                          Subject:
                        </Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Controller
                          name='subject'
                          control={control}
                          defaultValue={initialData?.subject || ''} // Use initialData for setting the default value
                          render={({ field }) => (
                            <TextField
                              {...field}
                              error={!!errors.subject}
                              helperText={errors.subject?.message || ''}
                              fullWidth
                            />
                          )}
                        />
                      </MUITableCell>
                    </TableRow>

                    <TableRow>
                      <MUITableCell>
                        <Typography variant='subtitle2' sx={{ color: 'text.primary', letterSpacing: '.1px' }}>
                          B/L NO:
                        </Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Controller
                          name='bl_number'
                          control={control}
                          defaultValue={initialData?.bl_number || ''} // Use initialData for setting the default value
                          render={({ field }) => (
                            <TextField
                              {...field}
                              error={!!errors.bl_number}
                              helperText={errors.bl_number?.message || ''}
                              fullWidth
                            />
                          )}
                        />
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='subtitle2' sx={{ color: 'text.primary', letterSpacing: '.1px' }}>
                          L/C NO:
                        </Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Controller
                          name='lc_number'
                          control={control}
                          defaultValue={initialData?.lc_number || ''} // Use initialData for setting the default value
                          render={({ field }) => (
                            <TextField
                              {...field}
                              error={!!errors.lc_number}
                              helperText={errors.lc_number?.message || ''}
                              fullWidth
                            />
                          )}
                        />
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='subtitle2' sx={{ color: 'text.primary', letterSpacing: '.1px' }}>
                          Remarks:
                        </Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Controller
                          name='remarks'
                          control={control}
                          defaultValue={initialData?.remarks || ''} // Use initialData for setting the default value
                          render={({ field }) => (
                            <TextField
                              {...field}
                              multiline
                              error={!!errors.remarks}
                              helperText={errors.remarks?.message || ''}
                              fullWidth
                            />
                          )}
                        />
                      </MUITableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ mb: theme => `${theme.spacing(1.25)} !important` }} />

      <RepeaterWrapper>
        <Repeater count={count}>
          {(i: number) => {
            const Tag = i === 0 ? Box : Collapse

            return (
              <Tag key={i} className='repeater-wrapper' {...(i !== 0 ? { in: true } : {})}>
                <Grid container>
                  <RepeatingContent item xs={12}>
                    <Grid container sx={{ py: 4, width: '100%', pr: { lg: 0, xs: 4 } }}>
                      <Grid item lg={4} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                        <Typography
                          variant='subtitle2'
                          className='col-title'
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                        >
                          Client Rate
                        </Typography>
                        <Controller
                          name='client_rate'
                          control={control}
                          defaultValue={initialData?.client_rate || ''} // Use initialData for setting the default value
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type='number'
                              error={!!errors.client_rate}
                              helperText={errors.client_rate?.message || ''}
                              fullWidth
                            />
                          )}
                        />
                      </Grid>
                      <Grid item lg={4} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                        <Typography
                          variant='subtitle2'
                          className='col-title'
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                        >
                          Our Rate
                        </Typography>
                        <Controller
                          name='our_rate'
                          control={control}
                          defaultValue={initialData?.our_rate || ''} // Use initialData for setting the default value
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type='number'
                              error={!!errors.our_rate}
                              helperText={errors.our_rate?.message || ''}
                              fullWidth
                            />
                          )}
                        />
                      </Grid>
                      <Grid item lg={2} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                        <Typography
                          variant='subtitle2'
                          className='col-title'
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                        >
                          No. of Items
                        </Typography>
                        <Controller
                          name='no_of_items'
                          control={control}
                          defaultValue={initialData?.no_of_items || ''} // Use initialData for setting the default value
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type='number'
                              error={!!errors.no_of_items}
                              helperText={errors.no_of_items?.message || ''}
                              fullWidth
                            />
                          )}
                        />
                      </Grid>
                      <Grid item lg={2} xs={12} sx={{ px: 4, my: { lg: 0 }, mt: 2 }}>
                        <Typography
                          variant='subtitle2'
                          className='col-title'
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                        >
                          Overweight
                        </Typography>
                        <Controller
                          name='overweight'
                          control={control}
                          defaultValue={initialData?.overweight || ''} // Use initialData for setting the default value
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type='number'
                              error={!!errors.overweight}
                              helperText={errors.overweight?.message || ''}
                              fullWidth
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </RepeatingContent>
                </Grid>
              </Tag>
            )
          }}
        </Repeater>
      </RepeaterWrapper>

      <Divider />

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
    </Card>
  )
}

export default AddCard
