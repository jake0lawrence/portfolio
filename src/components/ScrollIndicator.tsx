// src/components/ScrollIndicator.tsx
import { motion } from "framer-motion";
import { ChevronDown } from "react-icons/fi";

export const ScrollIndicator = () => (
  <motion.div
    animate={{ y: [0, 6, 0] }}
    transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
    className="text-base-content/70"
  >
    <ChevronDown size={24} aria-hidden="true" />
  </motion.div>
);
