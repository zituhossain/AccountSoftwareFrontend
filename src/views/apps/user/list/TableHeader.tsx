// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { fetchDataFromApi } from 'src/utils/api'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

interface TableHeaderProps {
  value: string
  toggle: () => void
  handleFilter: (val: string) => void
}

// Define type for user
interface User {
  id: number
  username: string
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, toggle, value } = props

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [data, setData] = useState<User[]>([])

  // useEffect(() => {
  //   fetchUsers()
  // }, [])

  // const fetchUsers = async () => {
  //   const users: User[] = await fetchDataFromApi('/api/users')
  //   setData(users)
  // }

  return (
    <>
      {/* {data?.[0]?.username} */}
      <Box
        sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Button
          sx={{ mr: 4, mb: 2 }}
          color='secondary'
          variant='outlined'
          startIcon={<Icon icon='mdi:export-variant' fontSize={20} />}
        >
          Export
        </Button>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size='small'
            value={value}
            sx={{ mr: 6, mb: 2 }}
            placeholder='Search User'
            onChange={e => handleFilter(e.target.value)}
          />

          <Button sx={{ mb: 2 }} onClick={toggle} variant='contained'>
            Add User
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default TableHeader

export async function getStaticProps() {
  const users: User[] = await fetchDataFromApi('/api/users')

  return {
    props: {
      users
    }
  }
}
