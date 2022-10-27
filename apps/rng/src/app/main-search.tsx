'use client'
import { Search } from '@elevateart/ui'
import clsx from 'clsx'

const graident = [
  ['from-[#ff3399]', 'to-[#ff3333]'],
  ['from-[#00ffff]', 'to-success'],
]

export default function Home() {
  return (
    <>
      <div className='relative group hover:scale-[1.1] transition duration-500'>
        <div
          className={clsx(
            'absolute -inset-1 bg-gradient-to-r rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200',
            graident[Math.floor(Math.random() * graident.length)].join(' ')
          )}
        />
        <Search className='w-full' placeholder='Search the metaverse' focus={false} />
      </div>
    </>
  )
}
