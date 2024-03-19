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

export const postDataToApi = async (endpoint: string, data: any) => {
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
