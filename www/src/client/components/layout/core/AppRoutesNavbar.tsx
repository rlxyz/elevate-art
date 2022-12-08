import clsx from 'clsx'
import { motion } from 'framer-motion'
import { capitalize } from 'src/client/utils/format'
import { Link } from '../Link'

export interface HeaderInternalPageRoutesProps {
  links: { name: string; enabled: boolean; href: string; loading: boolean }[]
}

export const AppRoutesNavbar = ({ links }: HeaderInternalPageRoutesProps) => {
  return (
    <aside className='-ml-5'>
      <ul className='flex list-none'>
        {links.map(({ name, enabled, href, loading }, index: number) => {
          return (
            <li key={index} className={enabled ? 'flex space-between items-center relative' : ''}>
              <div className={clsx('mb-1', loading && 'pointer-events-none')}>
                <Link disabled={loading} enabled={enabled} title={capitalize(name)} href={href} />
              </div>
              {enabled && <motion.div className='absolute bg-black mx-3 h-[2px] bottom-[-1px] left-0 right-0' layoutId='underline' />}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
