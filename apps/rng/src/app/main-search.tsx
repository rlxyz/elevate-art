'use client'
import { Search } from '@elevateart/ui'
import clsx from 'clsx'

export default function Home() {
  const graident = [
    ['from-[#00ffff]', 'to-success'],
    ['from-[#ff3399]', 'to-[#ff3333]'],
  ]
  return (
    <>
      <div className='relative group hover:scale-[1.1] transition duration-1000'>
        <div
          className={clsx(
            'absolute -inset-1 bg-gradient-to-r rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000',
            // graident[Math.floor(Math.random() * graident.length)].join(' ')
            graident[0]
          )}
        />
        <Search className='w-full' placeholder='Search the metaverse' focus={false} />
      </div>
    </>
  )
}
