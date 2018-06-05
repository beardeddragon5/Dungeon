'use strict';

class Dungeon {

  static get GRIDSIZE () { return 40 };

  constructor() {
    this.currentLevel = new Level(this);
    this.player = new Player(this, this.currentLevel.spawn.x, this.currentLevel.spawn.y);
    this.grid = new Grid(Dungeon.GRIDSIZE);
  }

  setup(ctx) {
    ctx.fillRect(0, 0, ctx.width, ctx.height);

    window.onresize = (win) => {
      ctx.width = document.body.clientWidth;
      ctx.height = document.body.clientHeight;

      ctx.canvas.width = ctx.width;
      ctx.canvas.height = ctx.height;

      this.grid.offset.x = this.player.x * this.grid.gridSize;
      this.grid.offset.y = this.player.y * this.grid.gridSize;
    }

    window.onresize();

    setInterval(() => {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, ctx.width, ctx.height);

      this.currentLevel.draw(ctx);
      this.player.draw(ctx);
    }, 16);
  }

  update() {
    this.player.update();
    this.currentLevel.update();
  }

}

class Grid {

  constructor(gridSize) {
    this.gridSize = gridSize;
    this.offset = { x: 100, y: 100 };
  }

  drawColor(ctx, x, y, color) {
    ctx.fillStyle = color;

    let [ rx, ry ] = this.calcContextPos(x, y);
    ctx.fillRect(rx, ry, this.gridSize + 3, this.gridSize + 3);
  }

  calcContextPos(gridX, gridY) {
    return [
      this.offset.x + (gridX * this.gridSize),
      this.offset.y + (gridY * this.gridSize)
    ];
  }
}


class Player {

  static get PROPWIDTH() { return 0.7 };
  static get INPUT_UPDATE_INTERVAL() { return 150; };
  static get GAME_OVER_TEXT() { return 'GAM3 0V3R'; };

  static get W(){ return 87; }
  static get S(){ return 83; }
  static get D(){ return 68; }
  static get A(){ return 65; }

  constructor(dungeon, x, y) {
    this.dungeon = dungeon;
    this.inventory = [];
    this._x = x;
    this._y = y;
    this.maxHealth = 100;
    this.health = 100;

    this.forward = false;
    this.backward = false;
    this.left = false;
    this.right = false;
    this.inputUpdate = false;

    window.onkeyup = (e) => {
      switch(e.keyCode) {
        case Player.W:
          this.forward = false;
          break;
        case Player.S:
          this.backward = false;
          break;
        case Player.A:
          this.left = false;
          break;
        case Player.D:
          this.right = false;
          break;
      }
    }

    window.onkeydown = (e) => {
      switch(e.keyCode) {
        case Player.W:
          this.forward = true;
          break;
        case Player.S:
          this.backward = true;
          break;
        case Player.A:
          this.left = true;
          break;
        case Player.D:
          this.right = true;
          break;
      }
      this.inputUpdate = true;
    }

  }

  set y(y) {
    let oldY = this._y;
    this._y = y;
    if ( oldY !== y ) {
      this.dungeon.update();
    }
  }

  get y() {
    return this._y;
  }

  set x(x) {
    let oldX = this._x;
    this._x = x;
    if ( oldX !== x ) {
      this.dungeon.update();
    }
  }

  get x() {
    return this._x;
  }

  update() {
    let levelSize = this.dungeon.currentLevel.width;
    let index = this.x + levelSize * this.y;
    let world = this.dungeon.currentLevel.world;

    if (world[index] && world[index].damage) {
      this.health -= world[index].damage;
    }
  }

  draw(ctx) {
    let levelSize = this.dungeon.currentLevel.width;
    let index = this.x + levelSize * this.y;
    let world = this.dungeon.currentLevel.world;

    if (this.inputUpdate) {
      this.inputUpdate = false;

      if (this.forward && world[index - levelSize] && !world[index - levelSize].solid) this.y--;
      if (this.backward && world[index + levelSize] && !world[index + levelSize].solid) this.y++;
      if (this.left && world[index - 1] && !world[index - 1].solid) this.x--;
      if (this.right && world[index + 1] && !world[index + 1].solid) this.x++;
    }
    index = this.x + levelSize * this.y;

    this.dungeon.grid.offset.x = ctx.width / 2 - this.x * this.dungeon.grid.gridSize;
    this.dungeon.grid.offset.y = ctx.height / 2 - this.y * this.dungeon.grid.gridSize;

    let [ rx, ry ] = this.dungeon.grid.calcContextPos(this.x, this.y);
    let size = this.dungeon.grid.gridSize;
    let offset = size * (1.0 - Player.PROPWIDTH) / 2;
    let width = size - 2 * offset;
    let height = size;

    ctx.fillStyle = 'brown';
    ctx.fillRect(rx + offset, ry - offset, width, height);

    this.drawHealth(ctx);

    if (this.health <= 0) {
      window.onkeyup = undefined;
      window.onkeydown = undefined;
      this.drawGameOver(ctx);
      window.onmouseup = (e) => {
        window.onmouseup = undefined;
        location.reload(true);
      };
    }
  }

  drawHealth(ctx) {
    ctx.fillStyle = '#444'
    ctx.fillRect(0, ctx.height - 30, 100, 30);
    ctx.fillStyle = '#B55';
    ctx.fillRect(5, ctx.height - 25, 90 * (this.health / this.maxHealth), 20);
    ctx.fillStyle = 'white';
    ctx.font = '18px monospace'
    ctx.textAlign = 'left';
    ctx.fillText(`${this.health}`, 6, ctx.height - 10, 90);
  }

  drawGameOver(ctx) {
    let fontSize = ctx.width / Player.GAME_OVER_TEXT.length;
    ctx.textAlign = 'center'
    ctx.font = `${fontSize}px monospace`

    let height = fontSize;
    let { width } = ctx.measureText(Player.GAME_OVER_TEXT);
    height += 10;
    width += 10;

    ctx.fillStyle = '#444';
    ctx.fillRect(ctx.width * 0.5 - width * 0.5, ctx.height * 0.5 - height * 0.8, width, height)
    ctx.fillStyle = 'white';
    ctx.fillText(Player.GAME_OVER_TEXT, ctx.width * 0.5, ctx.height * 0.5);
  }

}

class Level {

  static get WALL() { return { c: '#777', solid: true } };
  static get FLOOR() { return { c: '#AAA', solid: false } };
  static get SPAWN() { return { c: '#0F0', solid: false } };
  static get LAVA() { return { c: '#D44', solid: false, damage: 10 } };

  constructor(dungeon) {
    this.dungeon = dungeon;
    this.width = 30;
    this.height = 10;
    this.spawn = {
      x: 4,
      y: 4
    };
    this.generateLevel()
  }

  generateLevel() {
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
        this.world[i] = Math.random() < 0.8 ? Level.FLOOR : Level.LAVA;
      }
    }
  }

  update() {

  }

  draw(ctx) {
    this.world.forEach((tile, idx) => {
      let x = idx % this.width;
      let y = Math.floor(idx / this.width);

      this.dungeon.grid.drawColor(ctx, x, y, tile.c);
    });
  }

}

class Item {

}
