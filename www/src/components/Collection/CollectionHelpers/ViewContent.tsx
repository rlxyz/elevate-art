import clsx from 'clsx'

export const CollectionViewContentWrapper = ({ children }: { children: React.ReactNode }) => {
  return <main className='space-y-9 pl-8 py-8 min-h-[calc(100vh-19rem)]'>{children}</main>
}

export const CollectionViewContent = ({
  isLoading = false,
  children,
  title,
  description,
}: {
  isLoading?: boolean
  children: React.ReactNode
  title: string
  description: React.ReactNode
}) => {
  return (
    <CollectionViewContentWrapper>
      <div className='flex flex-col'>
        <div className='col-span-6 font-plus-jakarta-sans space-y-1'>
          <h1 className={clsx('text-2xl font-bold text-black', isLoading && 'animate-pulse')}>{title || '...'}</h1>
          <p className={clsx('text-sm text-darkGrey', isLoading && 'animate-pulse')}>{description || '...'}</p>
        </div>
      </div>
      <div>{children}</div>
    </CollectionViewContentWrapper>
  )
}
