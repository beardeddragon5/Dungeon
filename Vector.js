
export class Vec {

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(x = 0, y = 0) {
    if ( x instanceof Vec ) {
      this.x += x.x;
      this.y += x.y;
      return this;
    }
    if ( typeof x === 'number' ) {
      this.x += x;
      this.y += y;
      return this;
    }
    throw new TypeError('x must be Vec or number');
  }

  sub(x = 0, y = 0) {
    if ( x instanceof Vec ) {
      this.x -= x.x;
      this.y -= x.y;
      return this;
    }
    if ( typeof x === 'number' ) {
      this.x -= x;
      this.y -= y;
      return this;
    }
    throw new TypeError('x must be Vec or number');
  }

  scale(x) {
    if ( typeof x === 'number' ) {
      this.x *= x;
      this.y *= x;
      return this;
    }
    throw new TypeError('x must be number');
  }

  length(squared = true) {
    if (squared) {
      return this.x * this.x + this.y * this.y;
    }
    return Math.sqrt(this.length( true ));
  }

  normalize() {
    const length = this.length(false);
    if (length === 0) {
      return this;
    }

    this.x /= length;
    this.y /= length;
    return this;
  }

  cross(v) {
    return this.x * v.y - this.y * v.x;
  }

  clone() {
    return vec(this.x, this.y);
  }
}

export function vec(x = 0, y = 0) {
  return new Vec(x, y);
}
