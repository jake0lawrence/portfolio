import React from "react";
import { Button } from "@once-ui-system/core";
import styles from "./RecentProjectLink.module.scss";

interface RecentProjectLinkProps {
  slug: string;
  title: string;
}

export function RecentProjectLink({ slug, title }: RecentProjectLinkProps) {
  return (
    <Button
      className={styles.pill}
      data-border="rounded"
      href={`/work/${slug}`}
      variant="tertiary"
      size="s"
      weight="default"
      aria-label={`View ${title} project details`}
    >
      <>Recent project: <strong className="ml-4">{title}</strong></>
    </Button>
  );
}
