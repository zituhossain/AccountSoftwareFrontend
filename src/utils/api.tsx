import axios from 'axios'
import authConfig from 'src/configs/auth'
import { API_URL } from './urls'

export let storedToken: string | null = null
export let storedUser: string | null = null

// Check if window is available (i.e., in a browser environment)
if (typeof window !== 'undefined') {
  storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
  storedUser = window.localStorage.getItem(authConfig.storageUserKeyName)
}

export const fetchDataFromApi = async (endpoint: string) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${storedToken}`
    }
  }

  const res = await axios.get(`${API_URL}${endpoint}`, options)

  return res.data
}

export const postDataToApiFetch = async (endpoint: string, data: any) => {
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${storedToken}`
    },
    body: data
  }

  console.log('data', data)

  const res = await fetch(`${API_URL}${endpoint}`, options)

  return res.json()
}

export const postDataToApiAxios = async (endpoint: string, formData: FormData) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, formData, {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
    console.log('Data added successfully:', response.data)

    return response.data
  } catch (error: any) {
    console.error('Error posting data:', error.response ? error.response.data : error)
    throw error
  }
}

// export const putDataToApi = async (endpoint: string, data: any) => {
//   try {
//     const response = await axios.put(
//       `${API_URL}${endpoint}`,
//       { data },
//       {
//         headers: {
//           Authorization: `Bearer ${storedToken}`
//         }
//       }
//     )
//     console.log('Data updated successfully:', response.data)

//     return response.data
//   } catch (error) {
//     console.error('Error updating data:', error)
//     throw error // Rethrow the error for handling by the calling function
//   }
// }

export const putDataToApi = async (endpoint: string, formData: FormData) => {
  try {
    const response = await axios.put(`${API_URL}${endpoint}`, formData, {
      headers: {
        Authorization: `Bearer ${storedToken}`

        // 'Content-Type': 'multipart/form-data'
      }
    })
    console.log('Update successful:', response.data)

    return response.data
  } catch (error: any) {
    console.error('Error updating data:', error)
    throw error
  }
}

export const deleteDataFromApi = async (endpoint: string) => {
  try {
    const response = await axios.delete(`${API_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
    console.log('Data deleted successfully:', response.data)

    return response.data
  } catch (error: any) {
    console.error('Error updating data:', error)
    throw error // Rethrow the error for handling by the calling function
  }
}
