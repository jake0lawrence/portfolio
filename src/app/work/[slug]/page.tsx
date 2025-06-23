import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";

import { getPosts } from "@/app/utils/utils";
import { formatDate } from "@/app/utils/formatDate";
import { ScrollToHash, CustomMDX } from "@/components";

import {
  Meta,
  Schema,
  AvatarGroup,
  Button,
  Column,
  Flex,
  Heading,
  Text,
} from "@once-ui-system/core";

import { baseURL, about, person, work } from "@/resources";
import { projects } from "@/data/projects";

/* -------------------------------------------------------------------------- */
/*  Static generation helpers                                                 */
/* -------------------------------------------------------------------------- */

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["src", "app", "work", "projects"]);
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug ?? "";

  const post = getPosts(["src", "app", "work", "projects"]).find(
    (p) => p.slug === slugPath,
  );
  if (!post) return {};

  return Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL,
    image:
      post.metadata.image ||
      `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`,
    path: `${work.path}/${post.slug}`,
  });
}

/* -------------------------------------------------------------------------- */
/*  Page component                                                            */
/* -------------------------------------------------------------------------- */

export default async function Project({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const { slug } = await params;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug ?? "";

  const post = getPosts(["src", "app", "work", "projects"]).find(
    (p) => p.slug === slugPath,
  );
  if (!post) notFound();

  const project = projects.find((p) => p.slug === slugPath);

  const avatars =
    post.metadata.team?.map((member) => ({ src: member.avatar })) ?? [];

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l">
      {/* --- Structured data (JSON-LD) ----------------------------------- */}
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        path={`${work.path}/${post.slug}`}
        title={post.metadata.title}
        description={post.metadata.summary}
        datePublished={post.metadata.publishedAt}
        dateModified={post.metadata.publishedAt}
        image={
          post.metadata.image ||
          `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`
        }
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* --- Header ------------------------------------------------------ */}
      <Column maxWidth="xs" gap="16">
        <Button
          data-border="rounded"
          href="/work"
          variant="tertiary"
          weight="default"
          size="s"
          prefixIcon="chevronLeft"
        >
          Projects
        </Button>
        <Heading variant="display-strong-s">{post.metadata.title}</Heading>
      </Column>

      {/* --- Hero image -------------------------------------------------- */}
      {project?.hero && (
        <Image
          priority
          src={project.hero}
          alt={`${project.title} hero`}
          width={1600}
          height={900}
          sizes="(min-width:1024px) 70vw, 100vw"
          className="w-full h-auto rounded-xl mb-6"
        />
      )}

      {/* --- Content ----------------------------------------------------- */}
      <Column as="article" maxWidth="xs" style={{ margin: "auto" }}>
        <Flex gap="12" marginBottom="24" vertical="center">
          {avatars.length > 0 && (
            <AvatarGroup reverse avatars={avatars} size="m" />
          )}
          {post.metadata.publishedAt && (
            <Text variant="body-default-s" onBackground="neutral-weak">
              {formatDate(post.metadata.publishedAt)}
            </Text>
          )}
        </Flex>

        <CustomMDX source={post.content} />
      </Column>

      <ScrollToHash />
    </Column>
  );
}