import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";

/* ------------------------------------------------------------------ */
/* Types ------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
type Team = {
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
};

type Metadata = {
  title: string;
  publishedAt: string;          // ISO string or ""
  summary: string;
  image?: string;
  images: string[];
  tag?: string;
  team: Team[];
  link?: string;
};

/* ------------------------------------------------------------------ */
/* Helpers ---------------------------------------------------------- */
/* ------------------------------------------------------------------ */

/** Recursively collect every `.mdx` file under `dir`. */
function getMDXFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) notFound();

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getMDXFiles(fullPath));
    } else if (entry.isFile() && path.extname(entry.name) === ".mdx") {
      files.push(fullPath);
    }
  }
  return files;
}

/** Read an MDX file, strip a leading `"use client"` directive, and return front-matter + body. */
function readMDXFile(filePath: string) {
  if (!fs.existsSync(filePath)) notFound();

  let rawContent = fs.readFileSync(filePath, "utf-8");

  // ── strip `'use client'` directive if present ────────────────────
  if (
    rawContent.startsWith("'use client'") ||
    rawContent.startsWith('"use client"')
  ) {
    // split on CRLF *or* LF, remove the first line, join with LF
    rawContent = rawContent.split(/\r?\n/).slice(1).join("\n");
  }

  const { data, content } = matter(rawContent);

  const metadata: Metadata = {
    title: data.title || "",
    publishedAt: data.publishedAt || "",
    summary: data.summary || "",
    image: data.image || "",
    images: data.images || [],
    tag: data.tag || "",
    team: data.team || [],
    link: data.link || "",
  };

  return { metadata, content };
}

/** Turn the files under `dir` into `{ slug, metadata, content }[]`. */
function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);

  return mdxFiles.map((filePath) => {
    const { metadata, content } = readMDXFile(filePath);

    // build the slug (handles nested “…/post-slug/content.mdx” pattern)
    let slugPath = path
      .relative(dir, filePath)
      .replace(/\.mdx$/, ""); // remove extension

    if (
      path.basename(slugPath) === "content" &&
      path.dirname(slugPath) !== "."
    ) {
      slugPath = path.dirname(slugPath);
    }

    const slug = slugPath.split(path.sep).join("/");

    return { metadata, slug, content };
  });
}

/* ------------------------------------------------------------------ */
/* Public API ------------------------------------------------------- */
/* ------------------------------------------------------------------ */

/**
 * Return all posts.  
 * Pass a custom path array if your tests want to look somewhere else.
 */
export function getPosts(customPath = ["", "", "", ""]) {
  const postsDir = path.join(process.cwd(), ...customPath);
  return getMDXData(postsDir);
}