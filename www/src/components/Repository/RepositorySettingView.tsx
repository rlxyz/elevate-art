import { Link } from '@components/Layout/Link'
import { NextRouter, useRouter } from 'next/router'

export const SettingsNavigations = () => {
  return (
    <div>
      {[
        { name: 'General', selected: true },
        { name: 'Integrations', selected: false },
        { name: 'Git', selected: false },
      ].map(({ name, selected }, index) => {
        return (
          <div
            key={index}
            className={`hover:bg-lightGray hober:bg-opacity-30 hover:text-black rounded-[5px] ${
              selected ? 'text-black font-semibold' : 'text-darkGrey'
            }`}
          >
            <div className='px-1 py-2'>
              <Link href='#'>
                <span className='text-sm'>{name}</span>
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const CollectionSettingsContentItem = ({
  children,
  title,
  description,
}: {
  children: React.ReactNode
  title: string
  description: React.ReactNode
}) => {
  return (
    <div className='w-full rounded-[5px] border border-mediumGrey'>
      <div className='p-6 space-y-4'>
        <div className='flex flex-col'>
          <div className='col-span-6 font-plus-jakarta-sans space-y-2'>
            <h1 className='text-xl font-semibold text-black'>{title || '...'}</h1>
            <p className='text-sm text-black'>{description || '...'}</p>
          </div>
        </div>
        <div>{children}</div>
      </div>
      <footer className='w-full p-6 flex items-center h-[3rem] bg-lightGray text-xs  justify-between border-t border-t-mediumGrey'>
        <div className='flex'>
          <span>{`Learn more about`}&nbsp;</span>
          <Link href='#'>
            <div className='flex items-center text-blueHighlight'>
              <span>{title}</span>
              {/* <ArrowTopRightOnSquare className='w-3 h-3' /> */}
            </div>
          </Link>
        </div>
        <div>
          <div className='border border-mediumGrey px-4 py-2 rounded-[5px]'>
            <span className='text-darkGrey'>Save</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

const CollectionSettings = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const collectionName: string = router.query.collection as string
  const repositoryName: string = router.query.repository as string
  return (
    <CollectionSettingsContentItem
      title='Collection Name'
      description='Used to identify your collection on the repository dashboard'
    >
      <div className='w-full border border-mediumGrey rounded-[5px]'>
        <div className='h-full grid grid-cols-10 text-sm'>
          <div className='col-span-4 border-r border-r-mediumGrey rounded-l-[5px] bg-lightGray text-darkGrey flex items-center'>
            <span className='px-4 py-2'>{`elevate.art/${organisationName}/${repositoryName}/`}</span>
          </div>
          <div className='col-span-6 flex items-center'>
            <span className='px-4 py-2'>{collectionName}</span>
          </div>
          {/* <input className='col-span-6 p-2'>Test</input> */}
        </div>
      </div>
    </CollectionSettingsContentItem>
  )
}

export default CollectionSettings
