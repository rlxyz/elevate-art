import useCompilerViewStore from '@hooks/useCompilerViewStore'
import { ReactFragment } from 'react'

export const CollectionViewLeftbar = ({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) => {
  const { currentViewSection, setCurrentViewSection } = useCompilerViewStore(
    (state) => {
      return {
        regenerate: state.regenerate,
        setRegenerateCollection: state.setRegenerateCollection,
        currentViewSection: state.currentViewSection,
        setCurrentViewSection: state.setCurrentViewSection,
      }
    }
  )

  return (
    <main>
      <div className='border-b border-b-lightGray font-plus-jakarta-sans'>
        <div className='px-8 pt-8'>
          <h1 className='grid grid-cols-4 font-bold text-darkGrey flex flex-row'>
            <span className='col-span-1 text-2xl'>{title}</span>
          </h1>
          <div className='mt-5 flex justify-between'>
            {['Preview', 'Layers', 'Rarity', 'Rules'].map(
              (section: string, index: number) => {
                return (
                  <div key={`${section}-${index}`}>
                    <button
                      className={`pr-8 text-sm ${
                        currentViewSection == index
                          ? 'text-black min-h-full font-bold'
                          : 'text-darkGrey'
                      }`}
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentViewSection(index)
                      }}
                    >
                      {section}
                      <div className='mt-[1px]'>
                        <div
                          className={`${
                            currentViewSection == index
                              ? 'border-b-2 pb-2.5 translate-y-[1.5px]'
                              : ''
                          }`}
                        />
                        {currentViewSection == index && (
                          <div className='absolute h-[5px] w-[5px] bg-black rotate-45 translate-y-[-2px]' />
                        )}
                      </div>
                    </button>
                  </div>
                )
              }
            )}
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
  description: ReactFragment
}) => {
  return (
    <main className='min-h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] border-l border-l-lightGray'>
      <div className='grid grid-cols-8 border-b border-b-lightGray flex flex-col'>
        <div className='col-span-6 p-8 font-plus-jakarta-sans'>
          <h1 className='text-2xl font-bold text-black'>{title}</h1>
          <p className='mt-1 text-sm text-darkGrey'>{description}</p>
        </div>
      </div>
      <div className='max-h-[calc(100vh-13rem)]'>
        {children}
      </div>
    </main>
  )
}
