import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from './useAuth'
import { AppState } from '../types/state-type'
import { getApi } from '../api/api'

export default function useNotLoggedInRedirect(): {
  user: AppState['user']
  isReady: boolean
} {
  const router = useRouter()
  const { user } = useAuth()
  const [isReady, setIsReady] = useState<boolean>(!!user)
  useEffect(() => {
    if (isReady) return
    if (!user && typeof window !== 'undefined') {
      getApi().logoutRedirect?.()
    } else {
      setIsReady(true)
    }
  }, [router, user, isReady])
  return {
    user,
    isReady,
  }
}
