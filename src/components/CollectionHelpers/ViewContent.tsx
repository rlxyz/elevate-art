import { useCurrentLayer } from '@hooks/useCurrentLayer'
import useRepositoryRouterStore from '@hooks/useRepositoryRouterStore'
import useRepositoryStore from '@hooks/useRepositoryStore'
import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'
import { ReactFragment } from 'react'
import { LayerSectionEnum } from 'src/types/enums'

export const CollectionViewLeftbar = ({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) => {
  const { organisation, repository, collection } = useRepositoryStore((state) => {
    return {
      collection: state.collection,
      organisation: state.organisation,
      repository: state.repository,
    }
  })
  const { currentLayer } = useCurrentLayer()

  const { currentViewSection } = useRepositoryRouterStore((state) => {
    return {
      currentViewSection: state.currentViewSection,
    }
  })

  return (
    <main>
      <div className='border-b border-b-lightGray font-plus-jakarta-sans'>
        <div className='px-8 pt-8'>
          <h1 className='grid grid-cols-4 font-bold text-darkGrey flex flex-row'>
            <span className='col-span-1 text-2xl'>{title}</span>
          </h1>
          <div className='mt-5 flex justify-between'>
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
                    className={`pr-8 text-sm capitalize ${
                      currentViewSection == name
                        ? 'text-black min-h-full font-bold'
                        : 'text-darkGrey'
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
        </div>
      </div>
      {children}
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
    <main className='min-h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] border-l border-l-lightGray'>
      <div className='grid grid-cols-8 border-b border-b-lightGray flex flex-col'>
        <div className='col-span-6 p-8 font-plus-jakarta-sans'>
          <h1 className='text-2xl font-bold text-black'>{title}</h1>
          <p className='mt-1 text-sm text-darkGrey'>{description}</p>
        </div>
      </div>
      <div className='h-[calc(100vh-13rem)]'>{children}</div>
    </main>
  )
}
