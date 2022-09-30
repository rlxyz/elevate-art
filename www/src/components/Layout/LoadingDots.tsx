import type { FC } from 'react'

const LoadingDots: FC = () => {
  return (
    <span className='inline-flex text-center items-center leading-7'>
      <span className='animate-ping mx-0 my-2' key={`dot_1`} />
      <span className='animate-ping mx-0 my-2' key={`dot_2`} />
      <span className='animate-ping mx-0 my-2' key={`dot_3`} />
    </span>
  )
}

export default LoadingDots
