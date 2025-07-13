'use client';

import React, { useEffect, useState } from 'react';

export interface TypewriterTextProps {
  text: string;
  speed?: number;
}

export default function TypewriterText({ text, speed = 15 }: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let index = 0;
    let cancelled = false;

    function tick() {
      if (cancelled) return;
      setDisplayed(text.slice(0, index + 1));
      if (index < text.length - 1) {
        index += 1;
        timer = window.setTimeout(tick, speed);
      }
    }

    let timer = window.setTimeout(tick, speed);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text, speed]);

  return <span>{displayed}</span>;
}
