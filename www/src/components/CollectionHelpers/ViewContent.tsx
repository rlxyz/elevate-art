import { Link } from '@components/UI/Link'
import { useCurrentLayer } from '@hooks/useCurrentLayer'
import useRepositoryRouterStore from '@hooks/useRepositoryRouterStore'
import router from 'next/router'
import { LayerSectionEnum } from 'src/types/enums'

export const RepositoryNavbar = () => {
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const collectionName: string = router.query.collection as string
  const { currentLayer } = useCurrentLayer()
  const currentViewSection = useRepositoryRouterStore((state) => state.currentViewSection)

  return (
    <aside className='-ml-5'>
      <div className='flex mb-1'>
        {currentLayer &&
          [
            { name: LayerSectionEnum.enum.Preview, route: `${LayerSectionEnum.enum.Preview}` },
            {
              name: LayerSectionEnum.enum.Layers,
              route: `${LayerSectionEnum.enum.Layers}/${currentLayer?.name}`,
            },
            {
              name: LayerSectionEnum.enum.Rarity,
              route: `${LayerSectionEnum.enum.Rarity}/${currentLayer?.name}`,
            },
            {
              name: LayerSectionEnum.enum.Rules,
              route: `${LayerSectionEnum.enum.Rules}/${currentLayer?.name}`,
            },
            // {
            //   name: LayerSectionEnum.enum.Settings,
            //   route: `${LayerSectionEnum.enum.Settings}`,
            // },
          ].map(({ name, route }: { name: string; route: string }, index: number) => {
            return (
              <Link
                enabled={currentViewSection === name}
                title={name}
                size='md'
                href={`/${organisationName}/${repositoryName}/tree/${collectionName}/${route}`}
              />
            )
          })}
      </div>
    </aside>
  )
}

export const CollectionViewContentWrapper = ({ children }: { children: React.ReactNode }) => {
  return <main className='space-y-9 pl-8 py-8 min-h-[calc(100vh-19rem)]'>{children}</main>
}

export const CollectionViewContent = ({
  children,
  title,
  description,
}: {
  children: React.ReactNode
  title: string
  description: React.ReactNode
}) => {
  return (
    <CollectionViewContentWrapper>
      <div className='flex flex-col h-[4rem]'>
        <div className='col-span-6 font-plus-jakarta-sans space-y-3'>
          <h1 className='text-2xl font-bold text-black'>{title || '...'}</h1>
          <p className='text-sm text-darkGrey'>{description || '...'}</p>
        </div>
      </div>
      <div>{children}</div>
    </CollectionViewContentWrapper>
  )
}
