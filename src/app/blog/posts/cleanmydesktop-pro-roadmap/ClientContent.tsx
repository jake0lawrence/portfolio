'use client';
import { useEffect } from 'react';
import Content from './content.mdx';

export default function ClientContent() {
  useEffect(() => {
    // should appear in DevTools → Console after hydration
    console.log('[ClientContent] hydrated: cleanmydesktop-pro-roadmap');
  }, []);

  return <Content />;
}
