
export class Level {

  static get WALL() { return { c: '#777', solid: true }; }
  static get FLOOR() { return { c: '#AAA', solid: false }; }
  static get SPAWN() { return { c: '#0F0', solid: false }; }
  static get LAVA() { return { c: '#D44', solid: false, damage: 10 }; }

  constructor(dungeon) {
    this.dungeon = dungeon;
    this.width = 32;
    this.height = 10;
    this.spawn = {
      x: 4,
      y: 4
    };
    this.generateLevel();
  }

  generateLevel() {
    const CHANCE_FLOOR = 1; // 0.8;

    this.world = [];
    this.world[this.spawn.x + this.spawn.y * this.width] = Level.SPAWN;
    for (let x = 0; x < this.width; x++) {
      this.world[x] = Level.WALL;
      this.world[x + this.width * this.height] = Level.WALL;
    }
    for (let y = 0; y < this.height; y++) {
      this.world[y * this.width] = Level.WALL;
      this.world[y * this.width + this.width - 1] = Level.WALL;
    }
    for (let i = 0; i < this.width * this.height; i++) {
      if (!this.world[i]) {
        this.world[i] = Math.random() < CHANCE_FLOOR ? Level.FLOOR : Level.LAVA;
      }
    }
  }

  update() {

  }

  draw(ctx, tpf) {
    this.world.forEach((tile, idx) => {
      const x = idx % this.width;
      const y = Math.floor(idx / this.width);
      this.dungeon.grid.drawColor(ctx, x, y, tile.c);
    });
  }

}
