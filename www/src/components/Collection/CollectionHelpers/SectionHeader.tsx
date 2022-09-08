import { Button } from '@components/UI/Button'

const SectionHeaderHelper = () => {
  return (
    <div className='border border-lightGray rounded-[5px] px-4 py-3 max-w-[20%]'>
      <div className='space-y-4'>
        <span className='font-normal flex flex-col text-xs space-y-3'>
          <span className='font-semibold'>Guides</span>
          <span className='text-darkGrey'>Need some help with how the compiler works? Check out our guides.</span>
        </span>
        <Button className='border w-full rounded-[5px] text-xs py-1'>Learn More</Button>
      </div>
    </div>
  )
}

export const SectionHeader = ({ title, description }: { title: string; description: string }) => {
  return (
    <main className='pointer-events-auto'>
      <div className='flex justify-between items-center h-[10rem] space-y-2'>
        <div className='flex flex-col space-y-1'>
          <span className='text-3xl font-semibold'>{title}</span>
          <span className='text-sm text-darkGrey'>{description}</span>
        </div>
      </div>
    </main>
  )
}
   