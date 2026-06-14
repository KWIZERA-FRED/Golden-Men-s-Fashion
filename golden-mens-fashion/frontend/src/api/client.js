import axios from 'axios'

const client = axios.create({
  // Your Flask backend
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',

  headers: {
    'Content-Type': 'application/json',
  },

  withCredentials: false,
})

// =========================
// REQUEST INTERCEPTOR
// =========================
client.interceptors.request.use(

  (config) => {

    // GET JWT TOKEN
    const token = localStorage.getItem('gmf_token')

    // ATTACH TOKEN IF EXISTS
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },

  (error) => {
    return Promise.reject(error)
  }

)

// =========================
// RESPONSE INTERCEPTOR
// =========================
client.interceptors.response.use(

  (response) => {
    return response
  },

  (error) => {

    // HANDLE UNAUTHORIZED USERS
    if (error.response?.status === 401) {

      // REMOVE INVALID TOKEN
      localStorage.removeItem('gmf_token')

      // OPTIONAL REDIRECT
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }

)

export default client