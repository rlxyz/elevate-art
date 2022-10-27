import MainSearch from './main-search'
import R3FCanvas from './r3f-canvas'

export default async function Home() {
  return (
    <div className='w-full h-full'>
      <R3FCanvas />
      <div className='absolute top-[60%] left-1/2 -translate-x-1/2 w-screen flex justify-center'>
        <div className='w-1/2'>
          <MainSearch />
        </div>
      </div>
    </div>
  )
}
