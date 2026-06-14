import { useReducer, useEffect } from 'react'
import { AuthContext } from './AuthContext.js'

const initialState = {
  user: null,
  role: null,
  token: null,
  loading: true,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'RESTORE':
      return {
        user: action.user,
        role: action.role,
        token: action.token,
        loading: false,
      }

    case 'LOGIN':
      return {
        user: action.user,
        role: action.role,
        token: action.token,
        loading: false,
      }

    case 'LOGOUT':
      return {
        user: null,
        role: null,
        token: null,
        loading: false,
      }

    case 'DONE_LOADING':
      return { ...state, loading: false }

    default:
      return state
  }
}

export default function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const user = localStorage.getItem('gmf_user')
    const role = localStorage.getItem('gmf_role')
    const token = localStorage.getItem('gmf_token')

    if (user && role && token) {
      dispatch({
        type: 'RESTORE',
        user: JSON.parse(user),
        role,
        token,
      })
    } else {
      dispatch({ type: 'DONE_LOADING' })
    }
  }, [])

  const login = (userData, userRole, userToken) => {
    localStorage.setItem('gmf_user', JSON.stringify(userData))
    localStorage.setItem('gmf_role', userRole)
    localStorage.setItem('gmf_token', userToken)

    dispatch({
      type: 'LOGIN',
      user: userData,
      role: userRole,
      token: userToken,
    })
  }

  const logout = () => {
    localStorage.removeItem('gmf_user')
    localStorage.removeItem('gmf_role')
    localStorage.removeItem('gmf_token')

    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}