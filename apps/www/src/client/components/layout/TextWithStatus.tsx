export const TextWithStatus = ({ name }: { name: string | undefined }) => (
  <div className='flex space-x-2 items-center'>
    <span className='w-3 h-3 bg-greenDot border-mediumGrey bordder rounded-full' />
    <span>{name || ''}</span>
  </div>
)
