// ** React Import
import { useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// ** Icon and Spinner Imports
import axios from 'axios'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import { storedToken } from 'src/utils/api'
import { API_URL } from 'src/utils/urls'

interface Props {
  id: string | undefined
}

const PreviewActions = ({ id }: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleSendInvoice = async () => {
    setIsLoading(true) // Start loading
    try {
      const response = await axios.post(
        `${API_URL}/mails/invoice`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        }
      )

      if (response.data) {
        toast.success('Invoice sent successfully!')
        console.log('Invoice sent:', response.data)
      } else {
        toast.error('Failed to send the Invoice.')
      }
    } catch (error) {
      console.error('Error sending Invoice:', error)
      toast.error('Error sending Invoice. Please try again.')
    } finally {
      setIsLoading(false) // End loading regardless of the outcome
    }
  }

  return (
    <Card>
      <CardContent>
        {isLoading ? (
          <Spinner /> // Show Spinner when isLoading is true
        ) : (
          <>
            <Button
              fullWidth
              sx={{ mb: 3.5 }}
              variant='contained'
              onClick={handleSendInvoice}
              startIcon={<Icon icon='mdi:send-outline' />}
            >
              Send Invoice
            </Button>
            <Button
              fullWidth
              target='_blank'
              sx={{ mb: 3.5 }}
              component={Link}
              color='secondary'
              variant='outlined'
              href={`/apps/invoice/print/${id}`}
            >
              Print
            </Button>
            <Button
              fullWidth
              sx={{ mb: 3.5 }}
              component={Link}
              color='secondary'
              variant='outlined'
              href={`/apps/invoice/add?id=${id}`}
            >
              Edit Invoice
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default PreviewActions
