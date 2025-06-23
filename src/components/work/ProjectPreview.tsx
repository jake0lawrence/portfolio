"use client";

import Image from "next/image";
import Link from "next/link";
import { Column, Heading, Text } from "@once-ui-system/core";
import type { ProjectMeta } from "@/data/projects";

interface ProjectPreviewProps {
  project: ProjectMeta;
}

export default function ProjectPreview({ project }: ProjectPreviewProps) {
  return (
    <Link href={`/work/${project.slug}`} style={{ textDecoration: "none" }}>
      <Column gap="12" fillWidth>
        <Image
          src={project.thumbnail}
          alt="CleanMyDesktop Pro thumbnail"
          width={768}
          height={768}
          sizes="(max-width: 768px) 100vw, 300px"
          className="w-full max-w-[300px] h-auto rounded-xl shadow-lg"
          priority
        />
        <Heading as="h3" variant="heading-strong-m">
          {project.title}
        </Heading>
        <Text variant="body-default-s" onBackground="neutral-weak">
          {project.summary}
        </Text>
      </Column>
    </Link>
  );
}
