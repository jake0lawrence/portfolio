import * as ReactNS from 'react';
// Patch the module once so MDX's default import works
// @ts-expect-error – we knowingly add the field
(ReactNS as any).default = ReactNS;
export default ReactNS;
