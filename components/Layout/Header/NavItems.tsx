import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'

import { MenuList } from './MenuList'
import { NavItem } from './NavItem'

const header = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 1,
      staggerChildren: 0.2,
    },
  },
}

export const NavItems = () => {
  return (
    <motion.nav
      variants={header}
      initial="hidden"
      animate="visible"
      className="hidden md:flex text-white justify-center items-center"
    >
      {MenuList.map((menu, i) => {
        return (
          <NavItem key={i} href={menu.href} active={menu.active}>
            {menu.name}
          </NavItem>
        )
      })}
      <div className="ml-4 md:block flex justify-center space-x-6 md:order-2">
        <ConnectButton />
      </div>
    </motion.nav>
  )
}
