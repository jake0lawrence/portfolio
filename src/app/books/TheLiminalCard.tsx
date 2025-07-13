"use client";

import { Column, Flex, Heading, Media, SmartLink, Text } from '@once-ui-system/core';

interface TheLiminalCardProps {
  cover: string;
  synopsis: string;
  readLink: string;
}

export default function TheLiminalCard({
  cover,
  synopsis,
  readLink,
}: TheLiminalCardProps) {
  return (
    <Column gap="m" padding="24" radius="l" border="neutral-alpha-weak" fillWidth>
      <Media src={cover} alt="The Liminal cover" aspectRatio="3/4" radius="l" />
      <Heading as="h3" variant="heading-strong-m">
        The Liminal
      </Heading>
      <Text variant="body-default-s" onBackground="neutral-weak">
        {synopsis}
      </Text>
      <Flex gap="24" wrap>
        <SmartLink href={readLink} prefixIcon="book">
          <Text variant="body-default-s">Read</Text>
        </SmartLink>
      </Flex>
    </Column>
  );
}
