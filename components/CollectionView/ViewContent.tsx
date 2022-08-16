import useCompilerViewStore from '@hooks/useCompilerViewStore'
import { ReactFragment } from 'react'

export const CollectionViewLeftbar = ({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) => {
  const { setCurrentViewSection, currentViewSection } = useCompilerViewStore(
    (state) => {
      return {
        setCurrentViewSection: state.setCurrentViewSection,
        currentViewSection: state.currentViewSection,
      }
    }
  )

  return (
    <main>
      <div className='border-b border-b-lightGray font-plus-jakarta-sans'>
        <div className='px-8 pt-8'>
          <h1 className='text-2xl font-bold text-darkGrey'>{title}</h1>
          <div className='mt-5 flex'>
            {['Images', 'Rules', 'Generate'].map(
              (section: string, index: number) => {
                return (
                  <div key={`${section}-${index}`}>
                    <button
                      className={`pr-6 text-sm ${
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
    <main className='min-h-[calc(100vh-5rem)] border-l border-l-lightGray'>
      <div className='border-b border-b-lightGray'>
        <div className='p-8 font-plus-jakarta-sans'>
          <h1 className='text-2xl font-bold text-gray-900'>{title}</h1>
          <p className='mt-1 text-sm text-darkGrey'>{description}</p>
        </div>
      </div>
      {children}
    </main>
  )
}
