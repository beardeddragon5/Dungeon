import { Level } from './Level.js';
import { Player } from './Player.js';
import { Grid } from './Grid.js';

export class Dungeon {

  /* eslint-disable no-magic-numbers */
  static get GRIDSIZE() { return 40; }
  static get MS_PER_FRAME() { return 16; }
  static get SECOND_IN_MS() { return 1000; }
  /* eslint-enable no-magic-numbers */

  constructor() {
    this.currentLevel = new Level(this);
    this.player = new Player(this, this.currentLevel.spawn.x, this.currentLevel.spawn.y);
    this.grid = new Grid(Dungeon.GRIDSIZE);
  }

  setup(ctx) {
    ctx.fillRect(0, 0, ctx.width, ctx.height);
    let lastTime = Date.now();
    let tpf = 0;
    setInterval(() => {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, ctx.width, ctx.height);

      this.currentLevel.draw(ctx, tpf);
      this.player.draw(ctx, tpf);

      const now = Date.now();
      tpf = (now - lastTime) / Dungeon.SECOND_IN_MS;
      lastTime = now;
    }, 1);
  }

  onSizeUpdate(width, height) {
    this.grid.offset.x = this.player.pos.x * this.grid.gridSize;
    this.grid.offset.y = this.player.pos.y * this.grid.gridSize;
  }

  update() {
    this.player.update();
    this.currentLevel.update();
  }

}
