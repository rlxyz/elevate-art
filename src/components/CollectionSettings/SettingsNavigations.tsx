import Link from 'next/link'

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
