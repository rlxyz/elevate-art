import { RegegenerateButton } from '@components/CollectionPreview/RegenerateButton'
import useRepositoryRouterStore from '@hooks/useRepositoryRouterStore'
import * as React from 'react'

export const SectionHeader = () => {
  const currentViewSection = useRepositoryRouterStore((state) => state.currentViewSection)
  return (
    <main className='pointer-events-auto'>
      <div className='flex justify-between items-center h-[14rem] space-y-2'>
        <div className='flex flex-col space-y-1'>
          <span className='text-3xl font-semibold'>
            {SectionHeaderContent[currentViewSection].title}
          </span>
          <span className='text-sm text-darkGrey'>
            {SectionHeaderContent[currentViewSection].description}
          </span>
          {/*
              Search Component goes here...
              <div></div>
            */}
        </div>
        <div className='border border-lightGray rounded-[5px] px-4 py-3 max-w-[20%]'>
          <div className='space-y-4'>
            <span className='font-normal flex flex-col text-xs space-y-3'>
              <span className='font-semibold'>Generate</span>
              <span className='text-darkGrey'>
                You can regenerate your collection by clicking this button.
              </span>
            </span>
            <RegegenerateButton />
          </div>
        </div>
      </div>
    </main>
  )
}
const SectionHeaderContent = Object.freeze({
  preview: {
    title: 'Preview Collection',
    description: 'Create different token sets before finalising the collection',
  },
  layers: { title: 'All Layers', description: 'View and edit layers of your collection' },
  rarity: {
    title: 'Rarity',
    description: 'Set how often you want certain images to appear in the generation',
  },
  rules: {
    title: 'Custom Rules',
    description: 'Add custom rules for your traits so it layers perfectly!',
  },
})
