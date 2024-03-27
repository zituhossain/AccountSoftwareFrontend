// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import axios from 'axios'
import { API_URL } from 'src/utils/urls'
import toast from 'react-hot-toast'
import { storedToken } from 'src/utils/api'
import router from 'next/router'

interface Props {
  id: string | undefined
  toggleAddPaymentDrawer: () => void
  toggleSendInvoiceDrawer: () => void
}

const PreviewActions = ({ id, toggleSendInvoiceDrawer }: Props) => {
  const handleSendQuotation = async () => {
    try {
      // Here, replace `/send-quotation` with your actual endpoint path
      const response = await axios.post(
        `${API_URL}/mails`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        }
      )

      if (response.data) {
        toast.success('Quotation sent successfully!')
        console.log('Quotation sent:', response.data)
      } else {
        toast.error('Failed to send the quotation.')
      }
    } catch (error) {
      console.error('Error sending quotation:', error)
      toast.error('Error sending quotation. Please try again.')
    }
  }

  return (
    <Card>
      <CardContent>
        <Button
          fullWidth
          sx={{ mb: 3.5 }}
          variant='contained'
          onClick={handleSendQuotation}
          startIcon={<Icon icon='mdi:send-outline' />}
        >
          Send Quotation
        </Button>
        {/* <Button fullWidth sx={{ mb: 3.5 }} color='secondary' variant='outlined'>
          Download
        </Button> */}
        <Button
          fullWidth
          target='_blank'
          sx={{ mb: 3.5 }}
          component={Link}
          color='secondary'
          variant='outlined'
          href={`/apps/quotation/print/${id}`}
        >
          Print
        </Button>
        <Button
          fullWidth
          sx={{ mb: 3.5 }}
          component={Link}
          color='secondary'
          variant='outlined'
          href={`/apps/quotation/add?id=${id}`}
        >
          Edit Quotation
        </Button>
      </CardContent>
    </Card>
  )
}

export default PreviewActions
