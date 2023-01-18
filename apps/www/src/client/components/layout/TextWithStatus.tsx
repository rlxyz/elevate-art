export const TextWithStatus = ({ name }: { name: string | undefined }) => (
  <div className='flex space-x-2 items-center'>
    <span className='w-3 h-3 bg-greenDot border-mediumGrey bordder rounded-full' />
    <span>{name || ''}</span>
  </div>
)

export const TextWithLiveStatus = ({ name }: { name: string | undefined }) => (
  <div className='flex space-x-2 items-center'>
    <span>{name || ''}</span>
    <span className='inline-flex items-center rounded-full bg-lightGray bg-opacity-40 border border-redError py-0.5 px-2 lg:text-xs text-[0.6rem] font-medium text-redError'>
      Live
    </span>
  </div>
)
