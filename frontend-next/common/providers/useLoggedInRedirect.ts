import { useAuth } from './useAuth'
import { useEffect } from 'react'
import { API } from '../../project/api'

export default function () {
  const { user } = useAuth()
  useEffect(() => {
    if (user) {
      API.loginRedirect()
    }
  }, [user])
}
