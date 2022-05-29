import React from "react";
import { Discord, Instagram, Twitter } from "./Icons";
import SocialButton from "./SocialButton";
import { motion } from "framer-motion";

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

const Socials = () => {
  return (
    <motion.div
      variants={header}
      initial="hidden"
      animate="visible"
      className="pointer-events-auto flex lg:flex-col lg:justify-center justify-between items-center absolute bottom-0 mb-3 lg:mb-0 lg:top-1/2 lg:right-0 lg:mr-8 lg:transform lg:-translate-y-1/2 z-[1000]"
    >
      <SocialButton href="https://discord.gg/dreamlab">
        <Discord />
      </SocialButton>
      <SocialButton href="https://twitter.com/dreamlab">
        <Twitter />
      </SocialButton>
      <SocialButton href="https://instagram.com/dreamlab">
        <Instagram />
      </SocialButton>
    </motion.div>
  );
};

export default Socials;
