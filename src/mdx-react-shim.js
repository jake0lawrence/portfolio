// Tiny shim that satisfies both `import React from 'react'`
// and the modern JSX runtime (`react/jsx-runtime`).

import * as ReactNS from 'react';

/* ---------------------------------------------------------- */
/* 1 – guarantee a default export so MDX’s                   */
/*     `import React from 'react'` continues to work          */
/* ---------------------------------------------------------- */
if (!('default' in ReactNS)) {
  Object.defineProperty(ReactNS, 'default', {
    value: ReactNS,
    enumerable: false,
  });
}

/* ---------------------------------------------------------- */
/* 2 – runtime helpers expected by React 17+/Babel JSX        */
/* ---------------------------------------------------------- */
export const jsx        = (...args) => ReactNS.createElement(...args);
export const jsxs       = jsx;          // multi-children alias
export const jsxDEV     = jsx;          // dev-build alias
export const Fragment   = ReactNS.Fragment;

/* keep every normal React named export intact */
export * from 'react';
export default ReactNS;
