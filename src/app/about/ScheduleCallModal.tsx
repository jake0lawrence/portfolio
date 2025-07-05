"use client";

import { useState } from "react";
import { Dialog, IconButton, Button, Flex, Text } from "@once-ui-system/core";

export default function ScheduleCallModal() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        data-border="rounded"
        variant="secondary"
        icon="chevronRight"
      />
      <Dialog
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Coming soon"
        description={
          <Text variant="body-default-s" onBackground="neutral-weak">
            Calendar scheduling will be available soon.
          </Text>
        }
        footer={
          <Flex paddingTop="12" horizontal="end">
            <Button onClick={() => setOpen(false)} variant="primary">
              Close
            </Button>
          </Flex>
        }
      />
    </>
  );
}
