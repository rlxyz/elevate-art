import { CheckCircleIcon } from '@heroicons/react/outline'
import { FC } from 'react'

export const TraitSaveControl: FC<any> = () => {
  return (
    <button
      disabled
      type='button'
      onClick={() => console.log('todo')}
      className='bg-lightGray border border-mediumGrey text-darkGrey rounded-[5px] flex items-center justify-center text-xs px-2 disabled:cursor-not-allowed space-x-1'
      // className='bg-lightGray border border-greenDot text-greenDot font-semibold rounded-[5px] flex items-center justify-center text-xs px-2 disabled:cursor-not-allowed space-x-1'
    >
      <CheckCircleIcon className='w-4 h-4' />
      <span>Save</span>
    </button>
  )
}
