// ** React Imports
import { ForwardedRef, SyntheticEvent, forwardRef, useEffect, useState } from 'react'

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent, { CardContentProps } from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import Grid, { GridProps } from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { TableCellBaseProps } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { alpha, styled, useTheme } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Configs

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Custom Component Imports
import { Controller, useForm } from 'react-hook-form'
import Repeater from 'src/@core/components/repeater'

interface PickerProps {
  label?: string
}

interface Props {
  toggleAddCustomerDrawer: () => void
  invoiceNumber: number
  clients: any | undefined
  selectedClient: any | null
  setSelectedClient: (val: any | null) => void
  invoiceDetails: any[]
  setInvoiceDetails: any
  invoiceMasterId: number
  invoiceMasterData: any
  setInvoiceMasterData: any
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

const AddCard = (props: Props) => {
  // ** Props
  const {
    clients,
    invoiceNumber,
    selectedClient,
    setSelectedClient,
    invoiceDetails,
    setInvoiceDetails,
    invoiceMasterData,
    setInvoiceMasterData
  } = props
  const { control } = useForm()

  // ** States
  const [count, setCount] = useState<number>(1)
  const [selected, setSelected] = useState<string>('')
  const [issueDate, setIssueDate] = useState<DateType>(new Date())

  console.log('selected:', selected)

  // ** Hook
  const theme = useTheme()

  // ** Handle Invoice To Change
  const handleInvoiceChange = (event: SelectChangeEvent) => {
    setSelected(event.target.value)
    if (clients !== undefined) {
      setSelectedClient(clients.filter(i => i.id === event.target.value)[0])
      setInvoiceMasterData({ ...invoiceMasterData, client: event.target.value })
    }
  }

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setInvoiceMasterData({ ...invoiceMasterData, [name]: value })
  }

  // Update formData whenever date picker changes
  const handleDateChange = (date: Date, fieldName: string) => {
    setIssueDate(date)
    setInvoiceMasterData({ ...invoiceMasterData, [fieldName]: date })
  }

  // Function to handle changes in input fields
  const handleInputChange = (name: string, value: string, index: number) => {
    // Create a copy of the invoice details array
    const updatedInvoiceDetails = [...invoiceDetails]

    // Check if the array element at index exists, if not, initialize it
    if (!updatedInvoiceDetails[index]) {
      updatedInvoiceDetails[index] = {} // Initialize as empty object
    }

    // Update the corresponding item in the array
    updatedInvoiceDetails[index][name] = value

    // Update the state with the modified array
    setInvoiceDetails(updatedInvoiceDetails)
  }

  // Function to delete an invoice item
  const deleteInvoiceItem = (index: number) => {
    // Create a copy of the invoice details array
    const updatedInvoiceDetails = [...invoiceDetails]

    // Remove the item at the specified index
    updatedInvoiceDetails.splice(index, 1)

    // Update the state with the modified array
    setInvoiceDetails(updatedInvoiceDetails)

    setCount(prevCount => prevCount - 1)
  }

  // Function to calculate total amount
  // Function to calculate total amount
  const calculateTotalAmount = () => {
    let total = 0

    // Iterate over each invoice detail and calculate total amount
    invoiceDetails.forEach(detail => {
      // Assuming rate and overweight are present in each detail object
      const rate = Number(detail.rate) ? Number(detail.rate) : 0
      const overweight = Number(detail.overweight) ? Number(detail.overweight) : 0

      // Calculate total amount for the current detail
      const detailTotal = rate + overweight

      // Add the detail total to the overall total
      total += detailTotal
    })

    return total
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
                  Invoice
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
                <DatePicker
                  id='issue-date'
                  selected={issueDate}
                  customInput={<CustomInput />}
                  onChange={(date: Date) => handleDateChange(date, 'date')}
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
              Invoice To:
            </Typography>
            <Select size='small' value={selected} onChange={handleInvoiceChange} sx={{ mb: 4, width: '200px' }}>
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
                        <TextField
                          size='small'
                          placeholder=''
                          sx={{ maxWidth: '300px', '& .MuiInputBase-input': { color: 'text.secondary' } }}
                          onChange={e => handleFieldChange(e)}
                          name='subject'
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
                        <TextField
                          size='small'
                          placeholder=''
                          sx={{ maxWidth: '300px', '& .MuiInputBase-input': { color: 'text.secondary' } }}
                          onChange={e => handleFieldChange(e)}
                          name='bl_number'
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
                        <TextField
                          size='small'
                          placeholder=''
                          sx={{ maxWidth: '300px', '& .MuiInputBase-input': { color: 'text.secondary' } }}
                          onChange={e => handleFieldChange(e)}
                          name='lc_number'
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
                        <TextField
                          rows={2}
                          fullWidth
                          multiline
                          size='small'
                          sx={{ mt: 3.5 }}
                          onChange={e => handleFieldChange(e)}
                          name='remarks'
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
                      <Grid item lg={3} md={3} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                        <Controller
                          name='driver_name'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label='Driver Name'
                              placeholder='Driver Name'
                              onChange={e => handleInputChange('driver_name', e.target.value, i)}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item lg={3} md={3} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                        <Controller
                          name='driver_phone'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label='Driver Phone'
                              placeholder='Driver Phone'
                              onChange={e => handleInputChange('driver_phone', e.target.value, i)}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item lg={3} md={3} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                        <Controller
                          name='vehicle_no'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label='Vehicle No'
                              placeholder='Vehicle No'
                              onChange={e => handleInputChange('vehicle_number', e.target.value, i)}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item lg={3} md={3} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                        <Controller
                          name='container_number'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label='Container Number'
                              placeholder='Container Number'
                              onChange={e => handleInputChange('container_number', e.target.value, i)}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item lg={3} md={2} xs={12} sx={{ px: 4, my: { lg: 8, xs: 4 } }}>
                        <Controller
                          name='amount'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              size='small'
                              type='number'
                              label='Amount'
                              placeholder='Amount'
                              onChange={e => handleInputChange('rate', e.target.value, i)}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item lg={2.5} md={2} xs={12} sx={{ px: 4, my: { lg: 8, xs: 4 } }}>
                        <Controller
                          name='overweight'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              size='small'
                              type='number'
                              label='Overweight'
                              placeholder='Overweight'
                              onChange={e => handleInputChange('overweight', e.target.value ? e.target.value : '0', i)}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item lg={3} md={2} xs={12} sx={{ px: 4, my: { lg: 8, xs: 4 } }}>
                        <Controller
                          name='total_amount'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              size='small'
                              type='number'
                              label='Total Amount'
                              value={Number(invoiceDetails[i]?.rate) + Number(invoiceDetails[i]?.overweight)}
                              disabled
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                    <InvoiceAction>
                      <IconButton size='small' onClick={() => deleteInvoiceItem(i)}>
                        <Icon icon='mdi:close' fontSize={20} />
                      </IconButton>
                    </InvoiceAction>
                  </RepeatingContent>
                </Grid>
              </Tag>
            )
          }}
        </Repeater>

        <Grid container sx={{ mt: 4.75 }}>
          <Grid item xs={12} sx={{ px: 0 }}>
            <Button
              size='small'
              variant='contained'
              startIcon={<Icon icon='mdi:plus' fontSize={20} />}
              onClick={() => setCount(count + 1)}
            >
              Add Item
            </Button>
          </Grid>
        </Grid>
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
          <Grid item xs={12} sm={3} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
            <CalcWrapper>
              <Typography variant='body2'>Subtotal:</Typography>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                {calculateTotalAmount()}
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

      {/* <Divider sx={{ my: theme => `${theme.spacing(1)} !important` }} />

      <CardContent sx={{ pt: 4 }}>
        <InputLabel htmlFor='invoice-note'>Note:</InputLabel>
        <TextField
          rows={2}
          fullWidth
          multiline
          id='invoice-note'
          sx={{ '& .MuiInputBase-input': { color: 'text.secondary' } }}
          defaultValue='It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance projects. Thank You!'
        />
      </CardContent> */}
    </Card>
  )
}

export default AddCard
