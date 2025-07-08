import { Column, Flex, Icon, Text } from "@once-ui-system/core";
import { ReactNode } from "react";

interface CalloutProps {
  variant?: "info" | "warning" | "success" | "error";
  children: ReactNode;
}

export default function Callout({ variant = "info", children }: CalloutProps) {
  const iconMap = {
    info: "info",
    warning: "alertTriangle",
    success: "check",
    error: "xCircle",
  } as const;

  return (
    <Flex
      gap="8"
      padding="16"
      radius="l"
      background="surface"
      onBackground="neutral-strong"
    >
      <Icon name={iconMap[variant]} size="s" />
      <Column>
        <Text variant="body-default-s">{children}</Text>
      </Column>
    </Flex>
  );
}
