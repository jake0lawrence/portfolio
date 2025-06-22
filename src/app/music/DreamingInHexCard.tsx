"use client";

import { Column, Flex, Heading, Text, Tag } from '@once-ui-system/core';

interface DreamingInHexCardProps {
  embedUrl: string;
  title: string;
  year: string;
  bpm: number;
  tags: string[];
}

export default function DreamingInHexCard({
  embedUrl,
  title,
  year,
  bpm,
  tags,
}: DreamingInHexCardProps) {
  return (
    <Column gap="m" padding="24" radius="l" border="neutral-alpha-weak" fillWidth>
      <div style={{ position: 'relative', paddingBottom: '120%', height: 0, width: '100%' }}>
        <iframe
          src={embedUrl}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
          loading="lazy"
        />
      </div>
      <Heading as="h3" variant="heading-strong-m">
        {title}
      </Heading>
      <Text variant="label-default-s" onBackground="neutral-weak">
        {year} · {bpm} BPM
      </Text>
      <Flex gap="8" wrap>
        {tags.map((tag) => (
          <Tag key={tag} label={tag} variant="neutral" />
        ))}
      </Flex>
    </Column>
  );
}
