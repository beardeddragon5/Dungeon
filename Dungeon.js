/* global setInterval */

import { Level } from './Level.js';
import { Player } from './Player.js';
import { Grid } from './Grid.js';

export class Dungeon {

  static get GRIDSIZE( ) { const g = 40; return g; }
  static get MS_PER_FRAME() { const g = 16; return g; }

  constructor() {
    this.currentLevel = new Level(this);
    this.player = new Player(this, this.currentLevel.spawn.x, this.currentLevel.spawn.y);
    this.grid = new Grid(Dungeon.GRIDSIZE);
  }

  setup(ctx) {
    ctx.fillRect(0, 0, ctx.width, ctx.height);
    setInterval(() => {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, ctx.width, ctx.height);

      this.currentLevel.draw(ctx);
      this.player.draw(ctx);
    }, Dungeon.MS_PER_FRAME);
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
