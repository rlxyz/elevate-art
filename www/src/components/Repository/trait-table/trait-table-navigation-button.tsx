import clsx from 'clsx'
import { FC } from 'react'
import { TraitElementView, TraitElementViewType } from './index'

export const TraitNavigationButton: FC<{
  viewFilter: TraitElementViewType
  setViewFilter: (view: TraitElementViewType) => void
}> = ({ viewFilter, setViewFilter }) => {
  return (
    <div className={clsx('border bg-white border-mediumGrey rounded-[5px]')}>
      <div className={'flex w-full h-full divide-x divide-mediumGrey'}>
        <button
          type='button'
          onClick={() => setViewFilter(TraitElementView.enum.Table)}
          className={clsx(
            viewFilter === TraitElementView.enum.Table ? 'bg-lightGray text-black' : 'text-darkGrey',
            'flex w-full items-center justify-center space-x-2 p-2'
          )}
        >
          <ListIcon className='w-3 h-3' />
        </button>
        <button
          type='button'
          onClick={() => setViewFilter(TraitElementView.enum.Grid)}
          className={clsx(
            viewFilter === TraitElementView.enum.Grid && 'bg-lightGray text-black',
            'flex w-full items-center justify-center space-x-2 p-2 text-darkGrey'
          )}
        >
          <GridIcon className='w-3 h-3' />
        </button>
      </div>
    </div>
  )
}

const ListIcon: FC<any> = ({ className }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className={className}
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
    </svg>
  )
}
const GridIcon: FC<any> = ({ className }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.25}
      stroke='currentColor'
      className={className}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z'
      />
    </svg>
  )
}
