'use client'

import { useEffect } from 'react'
import { http } from '@/lib/http-common'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'

const useAxiosAuth = () => {
  const { data: session } = useSession()

  useEffect(() => {
    const requestInterceptor = http.interceptors.request.use((config) => {
      if (!config.headers["Authorization"] && session?.token) {
        config.headers["Authorization"] = `Bearer ${session?.token}`
      }
      return config
    })

    const refreshRequestInterceptor = http.interceptors.response.use(
      (res) => {
        return res
      },
      async (err) => {
        const originalConfig = err.config

        if (originalConfig.url !== '/sessions' && err.response) {
          // Access Token was expired
          if (err.response.status === 401 && !originalConfig._retry && session?.refreshToken) {
            originalConfig._retry = true

            try {
              const rs = await fetch(process.env.NEXT_PUBLIC_API + "/refresh-token", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  token: session.refreshToken,
                })
              })

              const newSession = await rs.json()

              const access = newSession.token
              const refresh = newSession.refreshToken

              localStorage.setItem('access-token', access)
              localStorage.setItem('refresh-token', refresh)

              return http(originalConfig)
            } catch (_error) {
              toast.error('Session time out. Please login again.', {
                id: 'sessionTimeOut',
              })
              // Logging out the user by removing all the tokens from local
              localStorage.removeItem('access-token')
              localStorage.removeItem('refresh-token')
              // Redirecting the user to the landing page
              window.location.href = window.location.origin + '/auth/login'
              return Promise.reject(_error)
            }
          }
        }
        return Promise.reject(err)
      },
    )

    return () => {
      http.interceptors.request.eject(requestInterceptor)
      http.interceptors.request.eject(refreshRequestInterceptor)
    }
  }, [session])

  return http
}

export default useAxiosAuth
