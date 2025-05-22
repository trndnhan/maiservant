// client/src/lib/axios.ts
import axios, { AxiosError, AxiosRequestConfig } from 'axios'

const instance = axios.create({
  baseURL: '',
  withCredentials: true
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token!)
  })
  failedQueue = []
}

instance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError & { config: AxiosRequestConfig & { _retry?: boolean } }) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const skipEndpoints = ['/api/auth/jwt/logout', '/api/auth/current_user']
      if (skipEndpoints.some((path) => originalRequest.url?.includes(path))) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
          }
          return instance(originalRequest)
        })
      }

      isRefreshing = true
      try {
        const { data } = await instance.post('/api/auth/jwt/refresh', {})

        const newToken = data.access_token
        instance.defaults.headers.common.Authorization = `Bearer ${newToken}`

        processQueue(null, newToken)

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`
        }
        return instance(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        if (typeof window !== 'undefined') {
          localStorage.setItem('showIdleToast', 'true')
          window.location.href = '/'
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default instance
