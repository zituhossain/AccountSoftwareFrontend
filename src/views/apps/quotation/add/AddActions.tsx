// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const OptionsWrapper = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}))

const AddActions = ({ handleSave }: any) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Button fullWidth sx={{ mb: 3.5 }} variant='contained' startIcon={<Icon icon='mdi:send-outline' />}>
              Send Invoice
            </Button>
            <Button fullWidth component={Link} sx={{ mb: 3.5 }} variant='outlined' href='/apps/invoice/preview/4987'>
              Preview
            </Button>
            <Button fullWidth variant='outlined' sx={{ mb: 3.5 }} onClick={handleSave}>
              Save
            </Button>
          </CardContent>
        </Card>
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
