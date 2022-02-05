import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../common/providers/useAuth'
import { AppState } from '../common/types/state-type'

export default function useUserRedirect(): {
  user: AppState['user']
  isReady: boolean
} {
  const router = useRouter()
  const { user } = useAuth()
  const [isReady, setIsReady] = useState<boolean>(!!user)
  useEffect(() => {
    if (isReady) return
    if (!user && typeof window !== 'undefined') {
      const redirect = encodeURIComponent(router.route)
      const as = encodeURIComponent(router.asPath)
      let path = `/?redirect=${redirect}`
      if (redirect !== as) {
        path += `&as=${as}`
      }
      router.replace(path)
    } else {
      setIsReady(true)
    }
  }, [router, user, isReady])
  return {
    user,
    isReady,
  }
}
