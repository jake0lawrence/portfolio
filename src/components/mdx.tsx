import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import React, { ReactNode } from "react";
import dynamic from "next/dynamic";
import remarkGfm from "remark-gfm";

import { 
  Heading,
  HeadingLink,
  Media,
  SmartLink,
  Text,
  InlineCode,
} from "@once-ui-system/core";
import { CodeBlock } from "@once-ui-system/core";
import { TextProps } from "@once-ui-system/core";
import { MediaProps } from "@once-ui-system/core";
import MarkdownTable from "@/components/MarkdownTable";

type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

function CustomLink({ href, children, ...props }: CustomLinkProps) {
  if (href.startsWith("/")) {
    return (
      <SmartLink href={href} {...props}>
        {children}
      </SmartLink>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

function createImage({ alt, src, ...props }: MediaProps & { src: string }) {
  if (!src) {
    console.error("Media requires a valid 'src' property.");
    return null;
  }

  return (
    <Media
      marginTop="8"
      marginBottom="16"
      enlarge
      radius="m"
      aspectRatio="16 / 9"
      border="neutral-alpha-medium"
      sizes="(max-width: 960px) 100vw, 960px"
      alt={alt}
      src={src}
      {...props}
    />
  );
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  const CustomHeading = ({ children, ...props }: Omit<React.ComponentProps<typeof HeadingLink>, 'as' | 'id'>) => {
    const text = React.Children.toArray(children)
      .map((child) => (typeof child === 'string' ? child : ''))
      .join('');
    const slug = slugify(text);
    return (
      <HeadingLink
        marginTop="24"
        marginBottom="12"
        as={as}
        id={slug}
        {...props}
      >
        {children}
      </HeadingLink>
    );
  };

  CustomHeading.displayName = `${as}`;

  return CustomHeading;
}

function createParagraph({ children }: TextProps) {
  return (
    <Text
      style={{ lineHeight: "175%" }}
      variant="body-default-m"
      onBackground="neutral-medium"
      marginTop="8"
      marginBottom="12"
    >
      {children}
    </Text>
  );
}

function createInlineCode({ children }: { children: ReactNode }) {
  return <InlineCode>{children}</InlineCode>;
}

function createCodeBlock(
  props: React.HTMLAttributes<HTMLPreElement> & {
    children?: React.ReactElement<{ className?: string; children?: React.ReactNode }>;
  }
) {
  // For pre tags that contain code blocks
  if (props.children && props.children.props && props.children.props.className) {
    const { className, children } = props.children.props;
    
    // Extract language from className (format: language-xxx)
    const language = className.replace('language-', '');
    const label = language.charAt(0).toUpperCase() + language.slice(1);

    if (language === 'mermaid') {
      const Mermaid = require('./Mermaid').default;
      return <Mermaid>{children}</Mermaid>;
    }

    return (
      <CodeBlock
        marginTop="8"
        marginBottom="16"
        codes={[
          {
            code: children,
            language,
            label,
          },
        ]}
        copyButton={true}
      />
    );
  }
  
  // Fallback for other pre tags or empty code blocks
  return <pre {...props} />;
}

const components = {
  p: createParagraph,
  h1: createHeading("h1"),
  h2: createHeading("h2"),
  h3: createHeading("h3"),
  h4: createHeading("h4"),
  h5: createHeading("h5"),
  h6: createHeading("h6"),
  img: createImage,
  a: CustomLink,
  code: createInlineCode,
  pre: createCodeBlock,
  table: MarkdownTable,
  Heading,
  Text,
  CodeBlock,
  InlineCode,
  Accordion: dynamic(() => import("@once-ui-system/core").then(mod => mod.Accordion)),
  AccordionGroup: dynamic(() => import("@once-ui-system/core").then(mod => mod.AccordionGroup)),
  Table: dynamic(() => import("@once-ui-system/core").then(mod => mod.Table)),
  Feedback: dynamic(() => import("@once-ui-system/core").then(mod => mod.Feedback)),
  Button: dynamic(() => import("@once-ui-system/core").then(mod => mod.Button)),
  Card: dynamic(() => import("@once-ui-system/core").then(mod => mod.Card)),
  Grid: dynamic(() => import("@once-ui-system/core").then(mod => mod.Grid)),
  Row: dynamic(() => import("@once-ui-system/core").then(mod => mod.Row)),
  Column: dynamic(() => import("@once-ui-system/core").then(mod => mod.Column)),
  Icon: dynamic(() => import("@once-ui-system/core").then(mod => mod.Icon)),
  Media: dynamic(() => import("@once-ui-system/core").then(mod => mod.Media)),
  SmartLink: dynamic(() => import("@once-ui-system/core").then(mod => mod.SmartLink)),
  Callout: dynamic(() => import("@/components/Callout")),
  Mermaid: dynamic(() => import("@/components/Mermaid")),
  PulseHeader: dynamic(() => import("@/components/PulseHeader")),
  AnimatedSignalPulse: dynamic(() => import("@/components/AnimatedSignalPulse")),
};

type CustomMDXProps = MDXRemoteProps & {
  components?: typeof components;
};

export function CustomMDX(props: CustomMDXProps) {
  return (
    <MDXRemote
      {...props}
      components={{
        ...components,
        ...(props.components || {}),
      } as MDXRemoteProps["components"]}
      options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
    />
  );
}