'use client';
import { useEffect } from 'react';
import Content from './content.mdx';

export default function ClientContent() {
  useEffect(() => {
    console.log('[ClientContent] hydrated: habit-tracker-beta-launch');
  }, []);

  return <Content />;
}
