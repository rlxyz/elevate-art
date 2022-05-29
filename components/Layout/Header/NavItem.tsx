import { motion } from "framer-motion";
import classNames from "classnames";
import Link from "next/link";

type NavItemProps = {
  children: React.ReactNode;
  href: string;
  active?: boolean;
};

export const NavItem = ({ children, href, active = false }: NavItemProps) => {
  return (
    <Link href={href} passHref>
      <motion.a
        whileHover={{
          color: !active && "#AAABAC",
        }}
        href={href}
        transition={{
          duration: 0.2,
        }}
        className={classNames(
          `lg:text-xl text-sm uppercase font-kiona-bold ml-4 cursor-pointer pointer-events-auto z-[1000]`,
          active ? "text-blend-pink" : "text-white"
        )}
      >
        {children}
      </motion.a>
    </Link>
  );
};
