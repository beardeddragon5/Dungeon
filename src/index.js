import * as Dung from './Dungeon.js';

import { Vec } from './Vector.js';

Math.lerp = function(x, y, t = 0) {
  if ( x instanceof Vec && y instanceof Vec ) {
    return x.clone().scale( 1 - t ).add(y.clone().scale(t));
  }
  return (1 - t) * x + t * y;
};


export const Dungeon = Dung.Dungeon;
