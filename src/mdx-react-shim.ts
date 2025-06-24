// Single place to add `default` when Next 13+ strips it out
import * as ReactNS from 'react';
if (!('default' in ReactNS)) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore – patching the runtime object
  (ReactNS as any).default = ReactNS;
}
export = ReactNS;

