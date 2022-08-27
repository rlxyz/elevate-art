import RepositoryImplementation from '@components/Repository/RepositoryImplementation'
import React, { useEffect } from 'react'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { NextRouter, useRouter } from 'next/router'
import { useKeybordShortcuts } from '@hooks/useKeyboardShortcuts'
import { trpc } from '@utils/trpc'
import { useCurrentLayer } from '@hooks/useCurrentLayer'
import { motion } from 'framer-motion'
import Loading from '@components/UI/Loading'

export const Index = () => {
  const { isLoading, isError } = useCurrentLayer()
  const [hasHydrated, setHasHydrated] = React.useState(false)
  const [hasErrored, setHasErrored] = React.useState(false)

  useEffect(() => {
    setHasHydrated(!isLoading)
  }, [isLoading])

  useEffect(() => {
    setHasErrored(isError)
  })

  if (!hasHydrated) return <Loading />
  if (hasErrored) return <div>Error...</div>

  return <RepositoryImplementation />
}
