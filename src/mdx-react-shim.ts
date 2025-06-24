import * as ReactNS from 'react';

// Provide a default export so `import React from 'react'` (added by MDX)
// gets a working object with createContext, etc.
(ReactNS as any).default = ReactNS;

export {};   // side-effect only

