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
      return { user: action.user, role: action.role, token: action.token, loading: false }
    case 'LOGIN':
      return { user: action.user, role: action.role, token: action.token, loading: false }
    case 'LOGOUT':
      return { user: null, role: null, token: null, loading: false }
    case 'DONE_LOADING':
      return { ...state, loading: false }
    default:
      return state
  }
}

export default function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const savedUser = localStorage.getItem('gmf_user')
    const savedRole = localStorage.getItem('gmf_role')
    const savedToken = localStorage.getItem('gmf_token')
    if (savedUser && savedRole && savedToken) {
      dispatch({
        type: 'RESTORE',
        user: JSON.parse(savedUser),
        role: savedRole,
        token: savedToken,
      })
    } else {
      dispatch({ type: 'DONE_LOADING' })
    }
  }, [])

  const login = (userData, userRole, userToken) => {
    localStorage.setItem('gmf_user', JSON.stringify(userData))
    localStorage.setItem('gmf_role', userRole)
    localStorage.setItem('gmf_token', userToken)
    dispatch({ type: 'LOGIN', user: userData, role: userRole, token: userToken })
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
