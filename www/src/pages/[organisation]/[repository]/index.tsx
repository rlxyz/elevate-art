import { Header } from '@components/Layout/Header'
import { Layout } from '@components/Layout/Layout'
import Loading from '@components/UI/Loading'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { Link } from '@components/UI/Link'
import useRepositoryRouterStore from '@hooks/useRepositoryRouterStore'
import { motion } from 'framer-motion'
import router from 'next/router'
import { RepositorySectionEnum } from 'src/types/enums'

export const RepositoryNavbar = () => {
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const currentViewSection = useRepositoryRouterStore((state) => state.currentViewSection)

  return (
    <aside className='-ml-5'>
      <ul className='flex list-none'>
        {[
          {
            name: RepositorySectionEnum.enum.Overview,
            route: `${RepositorySectionEnum.enum.Overview}`,
          },
        ].map(({ name, route }: { name: string; route: string }, index: number) => {
          return (
            <li
              key={index}
              className={
                name === currentViewSection ? 'flex space-between items-center relative' : ''
              }
            >
              <div className='mb-1'>
                <Link
                  enabled={currentViewSection === name}
                  title={name}
                  size='md'
                  href={`/${organisationName}/${repositoryName}/${route}`}
                ></Link>
              </div>
              {name === currentViewSection && (
                <motion.div
                  className='absolute bg-black mx-3 h-[2px] bottom-[-1px] left-0 right-0'
                  layoutId='underline'
                />
              )}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

// wrapper to hydate routes
const Page = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const collectionName: string = router.query.collection as string
  const repositoryName: string = router.query.repository as string
  const [hasHydrated, setHasHydrated] = useState<boolean>(false)

  useEffect(() => {
    setHasHydrated(Boolean(organisationName) && Boolean(repositoryName))
  }, [organisationName, repositoryName, collectionName])

  return hasHydrated ? (
    <Layout>
      <Layout.Header>
        <Header
          internalRoutes={[
            { current: organisationName },
            { current: repositoryName, options: ['roboghosts'] },
          ]}
        >
          <RepositoryNavbar />
        </Header>
      </Layout.Header>
      <Layout.Body>
        <div>Hi</div>
      </Layout.Body>
    </Layout>
  ) : (
    <Loading />
  )
}

export default Page
