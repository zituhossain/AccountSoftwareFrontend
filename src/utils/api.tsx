import axios from 'axios'
import { API_URL, STRAPI_API_TOKEN } from './urls'

export const fetchDataFromApi = async (endpoint: string) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + STRAPI_API_TOKEN
    }
  }

  const res = await axios.get(`${API_URL}${endpoint}`, options)

  return res.data
}
