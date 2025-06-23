"use client";

import { Icon, Flex } from "@once-ui-system/core";
import styles from "./ScrollIndicator.module.scss";

export function ScrollIndicator() {
  return (
    <a href="#about" className={styles.indicator} aria-hidden="true">
      <Icon name="chevronDown" decorative size="l" />
    </a>
  );
}
