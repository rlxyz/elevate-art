import { capitalize } from '@utils/format'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { HeaderInternalPageRoutesProps } from './Header'
import { Link } from './Link'

const HeaderInternalPageRoutes = ({ links }: HeaderInternalPageRoutesProps) => {
  return (
    <aside className='-ml-5'>
      <ul className='flex list-none'>
        {links.map(({ name, enabled, href, loading }, index: number) => {
          return (
            <li key={index} className={enabled ? 'flex space-between items-center relative' : ''}>
              <div className={clsx('mb-1', loading && 'pointer-events-none')}>
                <Link disabled={loading} enabled={enabled} title={capitalize(name)} size='md' href={href} />
              </div>
              {enabled && (
                <motion.div className='absolute bg-black mx-3 h-[2px] bottom-[-1px] left-0 right-0' layoutId='underline' />
              )}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default HeaderInternalPageRoutes
