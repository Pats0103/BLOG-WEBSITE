import { AnimatePresence, motion } from "framer-motion";
const AnimationWrapper = ({
  childern,
  Initial = { opacity: 0 },
  Animate = { opacity: 1 },
  Transition = { duration: 1 },
  className,
  keyValue,
}) => {
  return (
    <motion.div
      key={keyValue}
      initial={Initial}
      animate={Animate}
      transition={Transition}
      className={className}
    >
      {childern}
    </motion.div>
  );
};

export default AnimationWrapper;
