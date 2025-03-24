import axios from 'axios'

const fetchClient = axios.create({
  baseURL: 'https://frontend-take-home-service.fetch.com',
  withCredentials: true, // Required for auth cookie
})

export default fetchClient
