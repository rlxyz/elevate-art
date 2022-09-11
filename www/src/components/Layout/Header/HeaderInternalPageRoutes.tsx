import { Link } from '@components/UI/Link'
import { motion } from 'framer-motion'

interface HeaderInternalPageRoutesProps {
  links: { name: string; enabled: boolean; href: string }[]
}

const HeaderInternalPageRoutes = ({ links }: HeaderInternalPageRoutesProps) => {
  return (
    <aside className='-ml-5'>
      <ul className='flex list-none'>
        {links.map(({ name, enabled, href }, index: number) => {
          return (
            <li key={index} className={enabled ? 'flex space-between items-center relative' : ''}>
              <div className='mb-1'>
                <Link enabled={enabled} title={name} size='md' href={href}></Link>
              </div>
              {enabled && (
                <motion.div
                  className='absolute bg-black mx-3 h-[2px] bottom-[-1px] left-0 right-0'
                  layoutId='underline'
                />
              )}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default HeaderInternalPageRoutes
