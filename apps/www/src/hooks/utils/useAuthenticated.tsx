import { useSession } from '@elevateart/eth-auth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const useAuthenticated = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/connect')
    }
  }, [status])
  return { session, isLoggedIn: !!session }
}
