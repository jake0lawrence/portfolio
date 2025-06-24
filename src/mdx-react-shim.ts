import * as ReactNS from 'react';

/* If a `default` isn’t present, add one that points to the namespace */
if (!('default' in ReactNS)) {
  Object.defineProperty(ReactNS, 'default', {
    value: ReactNS,
    enumerable: false,
  });
}

export default ReactNS;   // enables `import React from 'react'`
export * from 'react';    // re-export everything else

