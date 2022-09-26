import { SectionHeader } from '@components/Collection/CollectionHelpers/SectionHeader'
import Index from '@components/Collection/Index'
import { Layout } from '@components/Layout/Layout'
import useCollectionNavigationStore from '@hooks/useCollectionNavigationStore'
import { useCurrentLayer } from '@hooks/useCurrentLayer'
import { NextRouter, useRouter } from 'next/router'
import { CollectionNavigationEnum, CollectionTitleContent } from 'src/types/enums'
import { useRepositoryRoute } from '../../../../hooks/useRepositoryRoute'

const Page = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const { currentLayer, isLoading } = useCurrentLayer()
  const currentViewSection = useCollectionNavigationStore((state) => state.currentViewSection)
  const { mainRepositoryHref, isLoading: isRoutesLoading } = useRepositoryRoute()

  return (
    <Layout>
      <Layout.Header
        internalRoutes={[
          { current: organisationName, href: `/${organisationName}` },
          { current: repositoryName, options: [repositoryName], href: `/${organisationName}/${repositoryName}` },
        ]}
        internalNavigation={[
          {
            name: CollectionNavigationEnum.enum.Preview,
            href: isRoutesLoading && `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Preview}`,
            enabled: CollectionNavigationEnum.enum.Preview === currentViewSection,
            forceDisabled: isLoading,
          },
          {
            name: CollectionNavigationEnum.enum.Layers,
            href: isRoutesLoading && `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Layers}/${currentLayer.name}`,
            enabled: CollectionNavigationEnum.enum.Layers === currentViewSection,
            forceDisabled: isLoading,
          },
          {
            name: CollectionNavigationEnum.enum.Rarity,
            href: isRoutesLoading && `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rarity}/${currentLayer.name}`,
            enabled: CollectionNavigationEnum.enum.Rarity === currentViewSection,
            forceDisabled: isLoading,
          },
          {
            name: CollectionNavigationEnum.enum.Rules,
            href: isRoutesLoading && `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rules}/${currentLayer.name}`,
            enabled: CollectionNavigationEnum.enum.Rules === currentViewSection,
            forceDisabled: isLoading,
          },
        ]}
      />
      <Layout.Title>
        <SectionHeader
          title={CollectionTitleContent[currentViewSection].title}
          description={CollectionTitleContent[currentViewSection].description}
        />
      </Layout.Title>
      <Layout.Body>
        <Index />
      </Layout.Body>
    </Layout>
  )
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const session = await getSession(context)
//   const token = await getToken({ req: context.req })
//   const userId = token?.sub ?? null
//   if (!userId) return { redirect: { destination: '/404', permanent: false } }
//   const { organisation, repository, collection } = context.query
//   const valid = await prisma.collection.findFirst({
//     where: {
//       name: collection as string,
//       repository: {
//         name: repository as string,
//         organisation: {
//           name: organisation as string,
//           admins: {
//             some: {
//               userId: userId,
//             },
//           },
//         },
//       },
//     },
//   })
//   if (!valid) return { redirect: { destination: `/404`, permanent: false } }
//   return {
//     props: {
//       userId,
//       session,
//     },
//   }
// }

export default Page
