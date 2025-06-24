// Runs once at startup in every bundle (server & client).
// It patches the CommonJS React export so `import React from 'react'`
// returns the namespace object with createContext, etc.

import * as ReactNS from 'react';

// @ts-expect-error – we're intentionally mutating the CJS export
(ReactNS as any).default = ReactNS;

export {};      // no exports – just side-effect
