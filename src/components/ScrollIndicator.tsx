// src/components/ScrollIndicator.tsx
'use client';

import { FiChevronDown } from 'react-icons/fi';
import styles from './ScrollIndicator.module.scss';

/**
 * A subtle, looping chevron that nudges visitors to scroll.
 *  – Decorative only: aria-hidden keeps screen readers quiet.
 *  – Wrapped in an anchor so <Enter>/<Space> also scroll.
 */
export function ScrollIndicator() {
  return (
    <a
      href="#about"
      aria-label="Scroll to the next section"
      className={styles.wrapper}
    >
      <FiChevronDown size={28} aria-hidden="true" />
    </a>
  );
}
