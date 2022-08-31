import { useCurrentLayer } from '@hooks/useCurrentLayer'
import useRepositoryRouterStore from '@hooks/useRepositoryRouterStore'
import useRepositoryStore from '@hooks/useRepositoryStore'
import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'
import { ReactFragment } from 'react'
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
    <main className='w-[20%]'>
      <div className='flex justify-between'>
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
        ].map(({ name, route }: { name: string; route: string }, index: number) => {
          return (
            <Link
              key={`${name}-${index}`}
              href={`/${organisation.name}/${repository.name}/tree/${collection.name}/${route}`}
            >
              <div
                className={`pr-8 text-xs capitalize ${
                  currentViewSection == name ? 'text-black min-h-full font-bold' : 'text-darkGrey'
                }`}
              >
                {name}
                <div className='mt-[1px]'>
                  <div
                    className={`${
                      currentViewSection == name ? 'border-b-2 pb-2.5 translate-y-[1.5px]' : ''
                    }`}
                  />
                  {currentViewSection == name && (
                    <div className='absolute h-[5px] w-[5px] bg-black rotate-45 translate-y-[-2px]' />
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
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
    <main className='space-y-9 pl-8 py-8 min-h-[calc(100vh-19rem)]'>
      <div className='flex flex-col h-[4rem]'>
        <div className='col-span-6 font-plus-jakarta-sans space-y-3'>
          <h1 className='text-2xl font-bold text-black'>{title || '...'}</h1>
          <p className='text-sm text-darkGrey'>{description || '...'}</p>
        </div>
      </div>
      <div>{children}</div>
    </main>
  )
}
