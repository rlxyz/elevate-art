import Card from '@components/layout/card/Card'
import SearchComponent from '@components/layout/search/Search'

export const OrganisationDisplayBodyNotFound = () => {
  return (
    <>
      <SearchComponent />
      <Card className='relative h-72 flex items-center justify-center'>
        <div className='absolute left-0 top-0 bg-lightGray animate-pulse w-full h-full z-0' />
        <div className='relative z-1 font-normal text-lg'>No items to display</div>
      </Card>
    </>
  )
}
