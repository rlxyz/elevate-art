import { useCurrentLayer } from '@hooks/useCurrentLayer'
import useRepositoryRouterStore from '@hooks/useRepositoryRouterStore'
import useRepositoryStore from '@hooks/useRepositoryStore'
import Link from 'next/link'
import { LayerSectionEnum } from 'src/types/enums'

export const RepositoryNavbar = () => {
  const { organisation, repository, collection } = useRepositoryStore((state) => {
    return {
      collection: state.collection,
      organisation: state.organisation,
      repository: state.repository,
    }
  })
  const { currentLayer } = useCurrentLayer()
  const currentViewSection = useRepositoryRouterStore((state) => state.currentViewSection)

  return (
    <aside>
      <div className='flex'>
        {[
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
            <div
              key={`${name}-${index}`}
              className={`hover:bg-mediumGrey hover:bg-opacity-50 rounded-[5px] mb-1 mx-2 ${
                !currentLayer ? 'pointer-events-none' : ''
              }`}
            >
              <Link
                href={`/${organisation.name}/${repository.name}/tree/${collection.name}/${route}`}
              >
                <div
                  className={`cursor-pointer text-xs flex px-3 py-2 hover:text-black items-center capitalize ${
                    currentViewSection == name
                      ? 'text-black min-h-full font-semibold'
                      : 'text-darkGrey'
                  }`}
                >
                  <div>{name}</div>
                  {/* <div className='mt-[1px]'>
                    <div
                      className={`${
                        currentViewSection == name ? 'border-b-2 pb-2.5 translate-y-[1.5px]' : ''
                      }`}
                    />
                    {currentViewSection == name && (
                      <div className='absolute h-[5px] w-[5px] bg-black rotate-45 translate-y-[-2px]' />
                    )}
                  </div> */}
                </div>
              </Link>
            </div>
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
