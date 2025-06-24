import * as ReactNS from 'react';

// Provide a default export so `import React from 'react'` works in MDX
// @ts-expect-error – React's types use export=, so we patch at runtime
(ReactNS as any).default = ReactNS;
