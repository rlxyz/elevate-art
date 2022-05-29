import { motion } from "framer-motion";
import classnames from "classnames";

const footer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 1,
      staggerChildren: 0.2,
    },
  },
};

export const Footer = () => {
  return (
    <motion.footer variants={footer} initial="hidden" animate="visible">
      <div
        className={classnames([
          "absolute w-full right-0 bottom-0 z-50 md:scale-100 scale-75",
          "p-3 sm:pb-4 xl:p-4 2xl:p-8",
          "mb-10 md:mb-8 sm:mb-12 lg:mb-0",
        ])}
      >
        <div className="flex justify-center flex-col m-auto w-[350px] text-center font-gilroy-extra-bold">
          <div className="flex text-hue-light justify-around w-full">
            <div className="uppercase text-sm">1111 Supply</div>
            <div className="uppercase text-sm">0.333 ETH</div>
          </div>
          <img src="/images/divider.svg" alt="Divider" className="w-full" />
          <div className="pt-2 font-kiona-regular text-xs text-white text-center z-50">
            A <span className="text-blend-pink">RLXYZ</span> PRODUCTION
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
