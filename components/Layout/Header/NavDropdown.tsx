import { useStore } from '@hooks/useStore'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'

import { Cross } from './Burger'
import { MenuList } from './MenuList'
import { NavItem } from './NavItem'

const variants = {
  open: { opacity: 1, y: '0' },
  closed: { opacity: 0, y: '-100%' },
}

export const NavDropdown = () => {
  const isDropdownOpen = useStore(state => state.isDropdownOpen)

  return (
    <motion.nav
      className="md:hidden absolute top-0 left-0 w-full flex flex-col justify-between items-center min-h-12 py-10 pointer-events-auto bg-black text-hue-light z-20"
      animate={isDropdownOpen ? 'open' : 'closed'}
      transition={{
        bounce: 0,
        duration: 0.2,
      }}
      variants={variants}
    >
      <Cross />
      {MenuList.map(({ href, name, active }, i) => {
        return (
          <div key={i} className="mt-8">
            <NavItem href={href} active={active}>
              {name}
            </NavItem>
          </div>
        )
      })}
      <div className="mt-4">
        <ConnectButton />
      </div>
    </motion.nav>
  )
}
