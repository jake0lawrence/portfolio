import { notFound } from "next/navigation";
import {
  CustomMDX,
  ScrollToHash,
} from "@/components";
import {
  Meta,
  Schema,
  AvatarGroup,
  Button,
  Column,
  Heading,
  HeadingNav,
  Icon,
  Row,
  Text,
} from "@once-ui-system/core";
import { baseURL, about, blog, person } from "@/resources";
import { formatDate } from "@/app/utils/formatDate";
import { getPosts } from "@/app/utils/utils";
import { Metadata } from "next";

/* ──────────────────────────────────────────────
   Helpers
─────────────────────────────────────────────── */
// Always return an **array of strings** (never null/obj/num).
const toStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(String) : [];

// Safe .includes for arrays/strings; always returns boolean ‍🛡️
const safeIncludes = (
  haystack: unknown,
  needle: string
): boolean =>
  (Array.isArray(haystack) || typeof haystack === "string")
    ? (haystack as any).includes(needle)
    : false;

/* ──────────────────────────────────────────────
   1. Static Params
─────────────────────────────────────────────── */
export async function generateStaticParams(): Promise<
  { slug: string }[]
> {
  const posts = getPosts(["src", "app", "blog", "posts"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

/* ──────────────────────────────────────────────
   2. Metadata
─────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug ?? "";

  const posts = getPosts(["src", "app", "blog", "posts"]);
  const post = posts.find((p) => p.slug === slugPath);

  if (!post) return {};

  return Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL,
    image:
      post.metadata.image ||
      `/api/og/generate?title=${encodeURIComponent(
        post.metadata.title
      )}`,
    path: `${blog.path}/${post.slug}`,
  });
}

/* ──────────────────────────────────────────────
   3. Page Component
─────────────────────────────────────────────── */
export default async function Blog({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const { slug } = await params;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug ?? "";

  const post =
    getPosts(["src", "app", "blog", "posts"]).find(
      (p) => p.slug === slugPath
    );

  if (!post) notFound();

  /* ---------- Safety guards for meta fields ---------- */
  const tags = toStringArray(post.metadata?.tags);
  const isDraft = safeIncludes(tags, "draft");

  const avatars =
    post.metadata.team?.map((p) => ({ src: p.avatar })) ?? [];

  return (
    <Row fillWidth>
      {/* Left gutter */}
      <Row maxWidth={12} hide="m" />

      {/* Main content */}
      <Row fillWidth horizontal="center">
        <Column as="section" maxWidth="xs" gap="l">
          {/* Schema.org ● only if not draft */}
          {!isDraft && (
            <Schema
              as="blogPosting"
              baseURL={baseURL}
              path={`${blog.path}/${post.slug}`}
              title={post.metadata.title}
              description={post.metadata.summary}
              datePublished={post.metadata.publishedAt}
              dateModified={post.metadata.publishedAt}
              image={
                post.metadata.image ||
                `/api/og/generate?title=${encodeURIComponent(
                  post.metadata.title
                )}`
              }
              author={{
                name: person.name,
                url: `${baseURL}${about.path}`,
                image: `${baseURL}${person.avatar}`,
              }}
            />
          )}

          <Button
            data-border="rounded"
            href="/blog"
            weight="default"
            variant="tertiary"
            size="s"
            prefixIcon="chevronLeft"
          >
            Posts
          </Button>

          <Heading variant="display-strong-s">
            {post.metadata.title}
          </Heading>

          <Row gap="12" vertical="center">
            {avatars.length > 0 && (
              <AvatarGroup size="s" avatars={avatars} />
            )}
            <Text
              variant="body-default-s"
              onBackground="neutral-weak"
            >
              {post.metadata.publishedAt &&
                formatDate(post.metadata.publishedAt)}
            </Text>
          </Row>

          <Column as="article" fillWidth>
            <CustomMDX source={post.content} />
          </Column>

          <ScrollToHash />
        </Column>
      </Row>

      {/* Right TOC */}
      <Column
        maxWidth={12}
        paddingLeft="40"
        fitHeight
        position="sticky"
        top="80"
        gap="16"
        hide="m"
      >
        <Row
          gap="12"
          paddingLeft="2"
          vertical="center"
          onBackground="neutral-medium"
          textVariant="label-default-s"
        >
          <Icon name="document" size="xs" />
          On this page
        </Row>
        <HeadingNav fitHeight />
      </Column>
    </Row>
  );
}
