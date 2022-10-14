import clsx from 'clsx'
import { Dispatch, SetStateAction } from 'react'

export const SearchInput = ({ setQuery, isLoading }: { setQuery: Dispatch<SetStateAction<string>>; isLoading: boolean }) => {
  return (
    <div className='relative'>
      <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className={clsx(isLoading && 'hidden', 'w-4 h-4 text-darkGrey')}
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
          />
        </svg>
      </div>

      <input
        onChange={(e) => setQuery(e.target.value)}
        type='text'
        className={clsx(
          isLoading ? 'bg-mediumGrey bg-opacity-50 animate-pulse rounded-[5px] w-full border-none' : 'border border-mediumGrey',
          'block text-xs w-full pl-10 rounded-[5px] py-2',
          'focus:outline-none focus:ring-1 focus:border-blueHighlight focus:ring-blueHighlight',
          'invalid:border-redError invalid:text-redError',
          'focus:invalid:border-redError focus:invalid:ring-redError'
        )}
        placeholder={isLoading ? '' : 'Search'}
      />
    </div>
  )
}
