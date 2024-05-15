import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import UserViewPage from 'src/views/apps/user/view/UserViewPage'
import { fetchDataFromApi } from 'src/utils/api'

const UserDetails = () => {
  const router = useRouter()
  const { id } = router.query
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (id) {
          const response = await fetchDataFromApi(`/users/${id}?populate[user_profile][populate]=*`)
          setUserData(response)
        }
      } catch (error) {
        console.error('Error fetching company details:', error)
      }
    }
    fetchUsers()
  }, [id])

  return <div>{userData ? <UserViewPage userData={userData} /> : <p>Loading...</p>}</div>
}

export default UserDetails
