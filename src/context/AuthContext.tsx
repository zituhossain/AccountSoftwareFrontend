import { createContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

// ** Types
import { AuthValuesType, ErrCallbackType, LoginParams, UserDataType } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const router = useRouter()

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      setLoading(true)
      const token = window.localStorage.getItem('accessToken')
      if (token) {
        try {
          const response = await axios.get('http://localhost:1337/api/users/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          setUser(response.data)
          setLoading(false)
        } catch (error) {
          setLoading(false)
          setUser(null)
          router.push('/login')
        }
      } else {
        setLoading(false)
      }
    }

    checkUserLoggedIn()
  }, [])

  const handleLogin = async ({ email, password, rememberMe }: LoginParams, errorCallback?: ErrCallbackType) => {
    console.log('Attempting login with email:', email)
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:1337/api/auth/local', {
        identifier: email,
        password: password
      })
      console.log('Login successful:', response.data) // Add this line to log the response
      const { user, jwt } = response.data
      if (rememberMe) {
        window.localStorage.setItem('accessToken', jwt)
      }
      setUser(user)
      setLoading(false)
      router.push('/')
    } catch (error: any) {
      console.error('Login failed:', error) // Add this line to log any errors
      setLoading(false)
      if (errorCallback) errorCallback(error)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('accessToken')
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
