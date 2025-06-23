import React from "react";

import {
  Heading,
  Flex,
  Text,
  Button,
  Avatar,
  RevealFx,
  Column,
  Meta,
  Schema,
} from "@once-ui-system/core";

import {
  home,
  about,
  person,
  newsletter,
  baseURL,
  routes,
  work,
} from "@/resources";

import { Mailchimp, RecentProjectLink } from "@/components";
import { getPosts } from "@/app/utils/utils";
import { Projects } from "@/components/work/Projects";
import ProjectPreview from "@/components/work/ProjectPreview";
import { projects } from "@/data/projects";
import { Posts } from "@/components/blog/Posts";

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Home() {
  // newest project → first in desc-date sort
  const [latestProject] = getPosts(["src", "app", "work", "projects"]).sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime(),
  );

  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      {/* ------------------------------------------------------------------ */}
      {/*  JSON-LD                                                           */}
      {/* ------------------------------------------------------------------ */}
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`/api/og/generate?title=${encodeURIComponent(home.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* ------------------------------------------------------------------ */}
      {/*  Hero section                                                      */}
      {/* ------------------------------------------------------------------ */}
      <Column fillWidth paddingY="24" gap="m">
        <Column maxWidth="s">
          {/* Recent project pill */}
          {home.featured.display && latestProject && (
            <RevealFx
              fillWidth
              horizontal="start"
              paddingTop="16"
              paddingBottom="32"
              paddingLeft="12"
            >
              <RecentProjectLink
                slug={latestProject.slug}
                title={latestProject.metadata.title}
              />
            </RevealFx>
          )}

          {/* Headline */}
          <RevealFx
            translateY="4"
            fillWidth
            horizontal="start"
            paddingBottom="16"
          >
            <Heading wrap="balance" variant="display-strong-l">
              {home.headline}
            </Heading>
          </RevealFx>

          {/* Sub-headline */}
          <RevealFx
            translateY="8"
            delay={0.2}
            fillWidth
            horizontal="start"
            paddingBottom="32"
          >
            <Text
              wrap="balance"
              onBackground="neutral-weak"
              variant="heading-default-xl"
            >
              {home.subline}
            </Text>
          </RevealFx>

          {/* NEW: primary CTA */}
          <RevealFx
            paddingTop="8"
            delay={0.3}
            horizontal="start"
            paddingLeft="12"
          >
            <Button
              aria-label="Explore Jake Lawrence's portfolio"
              data-border="rounded"
              href={work.path}
              variant="primary"
              size="m"
              weight="default"
            >
              Explore My Work
            </Button>
          </RevealFx>

          {/* About button */}
          <RevealFx
            paddingTop="12"
            delay={0.4}
            horizontal="start"
            paddingLeft="12"
          >
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
                    style={{ marginLeft: "-0.75rem" }}
                    src={person.avatar}
                    size="m"
                  />
                )}
                {about.title}
              </Flex>
            </Button>
          </RevealFx>
        </Column>
      </Column>

      {/* ------------------------------------------------------------------ */}
      {/*  Featured project preview                                          */}
      {/* ------------------------------------------------------------------ */}
      <RevealFx translateY="16" delay={0.6}>
        <ProjectPreview project={projects[0]} />
      </RevealFx>

      {/* ------------------------------------------------------------------ */}
      {/*  Latest blog posts                                                 */}
      {/* ------------------------------------------------------------------ */}
      {routes["/blog"] && (
        <Flex fillWidth gap="24" mobileDirection="column">
          <Flex flex={1} paddingLeft="l" paddingTop="24">
            <Heading as="h2" variant="display-strong-xs" wrap="balance">
              Latest from the blog
            </Heading>
          </Flex>
          <Flex flex={3} paddingX="20">
            <Posts range={[1, 2]} columns="2" />
          </Flex>
        </Flex>
      )}

      {/* ------------------------------------------------------------------ */}
      {/*  Other projects grid                                               */}
      {/* ------------------------------------------------------------------ */}
      <Projects range={[2]} />

      {/* ------------------------------------------------------------------ */}
      {/*  Newsletter signup                                                 */}
      {/* ------------------------------------------------------------------ */}
      {newsletter.display && <Mailchimp newsletter={newsletter} />}
    </Column>
  );
}
