// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import { Controller } from 'react-hook-form'

const OptionsWrapper = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}))

const AddActions = ({ handleSave, control }: any) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            {/* <Button fullWidth sx={{ mb: 3.5 }} variant='contained' startIcon={<Icon icon='mdi:send-outline' />}>
              Send Invoice
            </Button>
            <Button fullWidth component={Link} sx={{ mb: 3.5 }} variant='outlined' href='/apps/invoice/preview/4987'>
              Preview
            </Button> */}
            <Button fullWidth variant='outlined' sx={{ mb: 3.5 }} onClick={handleSave}>
              Save
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id='payment_option'>Payment Option</InputLabel>
          <Controller
            name='payment_option'
            control={control}
            render={({ field }) => (
              <Select {...field} label='Payment Option' labelId='payment_option'>
                <MenuItem value=''>Select Payment Option</MenuItem>
                <MenuItem value={0}>Cash</MenuItem>
                <MenuItem value={1}>On Account</MenuItem>
              </Select>
            )}
          />
          {/* <FormHelperText>{errors.payment_option?.message}</FormHelperText> */}
        </FormControl>
      </Grid>
      {/* <Grid item xs={12}>
        <OptionsWrapper sx={{ mb: 1 }}>
          <InputLabel
            htmlFor='invoice-add-payment-terms'
            sx={{ cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
          >
            Payment Terms
          </InputLabel>
          <Switch defaultChecked id='invoice-add-payment-terms' />
        </OptionsWrapper>
      </Grid> */}
    </Grid>
  )
}

export default AddActions
