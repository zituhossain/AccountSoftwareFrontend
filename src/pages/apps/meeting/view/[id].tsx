import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import MeetingViewPage from 'src/views/apps/meeting/view/MeetingViewPage' // Ensure this path is correct
import { fetchDataFromApi } from 'src/utils/api'

const MeetingDetails = () => {
  const router = useRouter()
  const { id } = router.query
  const [meetingData, setMeetingData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMeetingDetails = async () => {
      if (!id) return
      try {
        setLoading(true)
        const response = await fetchDataFromApi(`/meetings/${id}?populate=*`)
        setMeetingData(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching meeting details:', error)
        setError('Failed to fetch meeting details')
        setLoading(false)
      }
    }

    fetchMeetingDetails()
  }, [id])

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return <div>{meetingData ? <MeetingViewPage meetingData={meetingData} /> : <p>No meeting details available.</p>}</div>
}

export default MeetingDetails
