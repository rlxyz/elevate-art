import clsx from 'clsx'
import { motion } from 'framer-motion'
import type { FC } from 'react'
import React from 'react'
import { capitalize } from 'src/client/utils/format'
import { NextLinkWithHoverHueComponent } from '../link/NextLinkWithHoverHueComponent'

export interface HeaderInternalPageRoutesProps {
  name: string
  enabled: boolean
  href: string
  loading: boolean
}

const AppRoutesItem: FC<{ opts: HeaderInternalPageRoutesProps }> = ({ opts: { name, enabled, href, loading } }) => {
  return (
    <div className={clsx(enabled && 'flex space-between items-center relative')}>
      <div className={clsx(loading && 'pointer-events-none', 'mb-1')}>
        <NextLinkWithHoverHueComponent enabled={enabled} href={href}>
          {capitalize(name)}
        </NextLinkWithHoverHueComponent>
      </div>
      {enabled && <motion.div className='absolute bg-black mx-3 h-[2px] bottom-[-1px] left-0 right-0' layoutId='underline' />}
    </div>
  )
}

export const AppRoutesNavbar = ({ children }: { children: React.ReactElement[] | React.ReactElement }) => {
  const childrens = React.Children.toArray(children)
  return (
    <aside className='-ml-5'>
      <ul className='flex list-none'>
        {childrens.map((child, index: number) => {
          return <li key={index}>{child}</li>
        })}
      </ul>
    </aside>
  )
}

AppRoutesNavbar.Item = AppRoutesItem
