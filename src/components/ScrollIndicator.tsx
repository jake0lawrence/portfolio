import { FiChevronDown } from "react-icons/fi";
import styles from "./ScrollIndicator.module.scss";

/**
 * Animated chevron that prompts the user to scroll.
 * Decorative only – aria-hidden keeps SRs quiet.
 */
export const ScrollIndicator = () => (
  <div className={styles.wrapper} aria-hidden="true">
    <FiChevronDown size={28} />
  </div>
);
