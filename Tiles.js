
export class Tiles {

  static get WALL() { return { c: '#777', solid: true }; }
  static get FLOOR() { return { c: '#AAA', solid: false }; }
  static get SPAWN() { return { c: '#0F0', solid: false }; }
  static get LAVA() { return { c: '#D44', solid: false, damage: 10 }; }
  
}
