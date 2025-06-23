import React from "react";

import {
  Heading,
  Flex,
  Column,
  RevealFx,
  Schema,
} from "@once-ui-system/core";

import {
  home,
  about,
  person,
  newsletter,
  baseURL,
  routes,
} from "@/resources";

import {
  Mailchimp,
  HeroIntro,
  ScrollIndicator,
} from "@/components";

import { Projects } from "@/components/work/Projects";
import ProjectPreview from "@/components/work/ProjectPreview";
import { projects } from "@/data/projects";
import { Posts } from "@/components/blog/Posts";

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Home() {
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
      {/*  Hero section (animated)                                           */}
      {/* ------------------------------------------------------------------ */}
      <Column fillWidth paddingY="24" gap="m">
        <Column maxWidth="s">
          <HeroIntro />
          {/* Scroll hint */}
          <Flex horizontal="center" paddingTop="20">
            <a href="#about" aria-label="Scroll to about section">
              <ScrollIndicator aria-hidden="true" />
            </a>
          </Flex>
        </Column>
      </Column>

      {/* Anchor target for scroll indicator */}
      <div id="about" />

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
