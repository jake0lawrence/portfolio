'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Heading, Flex, Text, Button, Avatar, Badge, Row } from '@once-ui-system/core';
import { home, about, person } from '@/resources';

export function HeroIntro() {
  const reduce = useReducedMotion();

  const container = {
    show: {
      transition: reduce ? undefined : { staggerChildren: 0.12 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {home.featured.display && (
        <motion.div variants={item}>
          <Flex
            fillWidth
            horizontal="start"
            paddingTop="16"
            paddingBottom="32"
            paddingLeft="12"
          >
            <Badge
              background="brand-alpha-weak"
              paddingX="12"
              paddingY="4"
              onBackground="neutral-strong"
              textVariant="label-default-s"
              arrow={false}
              href={home.featured.href}
            >
              <Row paddingY="2">{home.featured.title}</Row>
            </Badge>
          </Flex>
        </motion.div>
      )}
      <motion.div variants={item}>
        <Flex fillWidth horizontal="start" paddingBottom="16">
          <Heading wrap="balance" variant="display-strong-l">
            {home.headline}
          </Heading>
        </Flex>
      </motion.div>
      <motion.div variants={item}>
        <Flex fillWidth horizontal="start" paddingBottom="32">
          <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
            {home.subline}
          </Text>
        </Flex>
      </motion.div>
      <motion.div variants={item}>
        <Flex paddingTop="12" horizontal="start" paddingLeft="12">
          <Button
            id="about"
            data-border="rounded"
            href={about.path}
            variant="secondary"
            size="m"
            weight="default"
            arrowIcon
          >
            <Flex gap="8" vertical="center" paddingRight="4">
              {about.avatar.display && (
                <Avatar
                  marginRight="8"
                  style={{ marginLeft: '-0.75rem' }}
                  src={person.avatar}
                  size="m"
                />
              )}
              {about.title}
            </Flex>
          </Button>
        </Flex>
      </motion.div>
    </motion.div>
  );
}
