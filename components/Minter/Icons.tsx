import { motion } from "framer-motion";

const transition = { delay: 2.5, duration: 2 };

export const TopEdgeBorder = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="52"
      height="52"
      viewBox="0 0 52 52"
      fill="none"
    >
      <motion.path
        d="M51 1H4C2.34315 1 1 2.34315 1 4V51"
        stroke="white"
        strokeOpacity="0.75"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={transition}
      ></motion.path>
    </svg>
  );
};

export const BottomEdgeBorder = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="52"
      height="52"
      viewBox="0 0 52 52"
      fill="none"
    >
      <motion.path
        d="M0.999999 51H48C49.6569 51 51 49.6569 51 48V1"
        stroke="white"
        strokeOpacity="0.75"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={transition}
      ></motion.path>
    </svg>
  );
};
