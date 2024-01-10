// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import axiosInstance from 'src/store/axiosDefaults'

// ** JWT import
import jwt from 'jsonwebtoken'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        axios.defaults.headers.common.Authorization = `Bearer ${storedToken}`
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${storedToken}`
        setLoading(true)
        await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: `${storedToken}`
            }
          })
          .then(async response => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setLoading(false)

            // setUser({ ...response.data })
            window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.access)
            const returnUrl = router.query.returnUrl

            // decode jwt token
            const decodedToken = jwt.decode(response.data.access, { complete: true })
            const userData = { ...decodedToken.payload }
            setUser(userData)
            window.localStorage.setItem('userData', JSON.stringify(userData))
            const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
            router.replace(redirectURL)
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params, errorCallback) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        axios.defaults.headers.common.Authorization = `Bearer ${response.data.access}`
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${response.data.access}`
        window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.access)
        const returnUrl = router.query.returnUrl

        // decode jwt token
        const decodedToken = jwt.decode(response.data.access, { complete: true })
        const userData = { ...decodedToken.payload }
        setUser(userData)
        window.localStorage.setItem('userData', JSON.stringify(userData))
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
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
