import { useContext } from 'react'
import { AuthContext } from './AuthContext.js'

export default function useAuth() {
  return useContext(AuthContext)
}