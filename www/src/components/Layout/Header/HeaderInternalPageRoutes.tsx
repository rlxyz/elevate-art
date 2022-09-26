import { Link } from '@components/UI/Link'
import clsx from 'clsx'
import { motion } from 'framer-motion'

export interface HeaderInternalPageRoutesProps {
  links: { name: string; enabled: boolean; href: string; forceDisabled: boolean }[]
}

const HeaderInternalPageRoutes = ({ links }: HeaderInternalPageRoutesProps) => {
  return (
    <aside className='-ml-5'>
      <ul className='flex list-none'>
        {links.map(({ name, enabled, href, forceDisabled }, index: number) => {
          return (
            <li key={index} className={enabled ? 'flex space-between items-center relative' : ''}>
              <div className={clsx('mb-1', forceDisabled && 'pointer-events-none')}>
                <Link enabled={enabled} title={name} size='md' href={href} />
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
