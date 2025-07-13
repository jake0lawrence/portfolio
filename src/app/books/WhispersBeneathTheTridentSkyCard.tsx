"use client";

import { Column, Flex, Heading, Media, SmartLink, Text } from '@once-ui-system/core';

interface WhispersBeneathTheTridentSkyCardProps {
  cover: string;
  synopsis: string;
  readLink: string;
}

export default function WhispersBeneathTheTridentSkyCard({
  cover,
  synopsis,
  readLink,
}: WhispersBeneathTheTridentSkyCardProps) {
  return (
    <Column gap="m" padding="24" radius="l" border="neutral-alpha-weak" fillWidth>
      <Media src={cover} alt="Whispers Beneath the Trident Sky cover" aspectRatio="3/4" radius="l" />
      <Heading as="h3" variant="heading-strong-m">
        Whispers Beneath the Trident Sky
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
