
export const CollectionViewContentWrapper = ({ children }: { children: React.ReactNode }) => {
  return <main className='space-y-9 pl-8 py-8 min-h-[calc(100vh-19rem)]'>{children}</main>
}

export const CollectionViewContent = ({
  children,
  title,
  description,
}: {
  children: React.ReactNode
  title: string
  description: React.ReactNode
}) => {
  return (
    <CollectionViewContentWrapper>
      <div className='flex flex-col h-[4rem]'>
        <div className='col-span-6 font-plus-jakarta-sans space-y-3'>
          <h1 className='text-2xl font-bold text-black'>{title || '...'}</h1>
          <p className='text-sm text-darkGrey'>{description || '...'}</p>
        </div>
      </div>
      <div>{children}</div>
    </CollectionViewContentWrapper>
  )
}
