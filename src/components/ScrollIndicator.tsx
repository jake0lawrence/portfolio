import { FiChevronDown } from "react-icons/fi";
import styles from "./ScrollIndicator.module.scss";

export const ScrollIndicator = () => (
  <div className={styles.wrapper} aria-hidden="true">
    <FiChevronDown size={28} />
  </div>
);
