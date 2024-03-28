import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material'

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          No
        </Button>
        <Button onClick={onConfirm} color='primary' autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default ConfirmDialog
