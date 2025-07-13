'use client';

import React from 'react';
import clsx from 'clsx';
import TypewriterText from './TypewriterText';

export interface AnimatedSignalPulseProps {
  id: string | number;
  label: string;
  glow: 'gold' | 'green' | 'indigo';
}

const glowMap: Record<AnimatedSignalPulseProps['glow'], string> = {
  gold: 'border-yellow-300 text-yellow-300 bg-yellow-300/10 shadow-[inset_0_0_4px_rgba(253,224,71,0.6)]',
  green: 'border-green-300 text-green-300 bg-green-300/10 shadow-[inset_0_0_4px_rgba(134,239,172,0.6)]',
  indigo: 'border-indigo-300 text-indigo-300 bg-indigo-300/10 shadow-[inset_0_0_4px_rgba(165,180,252,0.6)]',
};

export default function AnimatedSignalPulse({ id, label, glow }: AnimatedSignalPulseProps) {
  return (
    <div
      className={clsx(
        'inline-block rounded-md border px-3 py-1 font-mono text-xs',
        glowMap[glow]
      )}
    >
      <TypewriterText text={`/* ——— ${id} :: ${label} ——— */`} />
    </div>
  );
}
