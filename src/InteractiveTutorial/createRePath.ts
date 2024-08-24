import { parse } from 'react-native-redash';

import type { Layout } from './types';

export default function createRePath(layout: Layout) {
  const radius = layout.borderRadius ?? 1;
  const { pageX, pageY, width, height } = layout;

  return parse(`
    M${pageX + radius} ${pageY}
    H${pageX + width - radius}
    A${radius},${radius} 0 0 1 ${pageX + width} ${pageY + radius}
    V${pageY + height - radius}
    A${radius},${radius} 0 0 1 ${pageX + width - radius} ${pageY + height}
    H${pageX + radius}
    A${radius},${radius} 0 0 1 ${pageX} ${pageY + height - radius}
    V${pageY + radius}
    A${radius},${radius} 0 0 1 ${pageX + radius} ${pageY}
    Z
  `);
}
