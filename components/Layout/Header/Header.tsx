import { motion } from "framer-motion";
import { NavItems } from "./NavItems";
import { Burger } from "./Burger";
import { NavDropdown } from "./NavDropdown";

const header = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 1,
      staggerChildren: 0.2,
    },
  },
};

export const Header = () => {
  return (
    <header className="absolute top-0 left-0 w-full flex justify-between min-h-12 p-8 2xl:p-8 pointer-events-auto z-[1000]">
      <motion.h1 variants={header} initial="hidden" animate="visible">
        <div className="uppercase z-[1000]">
          <h1 className="text-white text-xl">
            <span className="font-kiona-bold lg:text-xl text-sm">RLXYZ</span>{" "}
            <span className="font-kiona-light lg:text-lg text-xs ml-1">
              <span className="text-blend-pink">Mint Client</span>
            </span>
          </h1>
        </div>
      </motion.h1>
      <NavItems />
      <Burger />
      <NavDropdown />
    </header>
  );
};
