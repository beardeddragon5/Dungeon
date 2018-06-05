/* global window, location */

export class Player {

  static get PROPWIDTH() { const g = 0.7; return g; }
  static get INPUT_UPDATE_INTERVAL() { const g = 150; return g; }
  static get GAME_OVER_TEXT() { return 'GAM3 0V3R'; }

  static get W(){ const g = 87; return g; }
  static get S(){ const g = 83; return g; }
  static get D(){ const g = 68; return g; }
  static get A(){ const g = 65; return g; }

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
      default:
        break;
      }
    };

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
      default:
        break;
      }
      this.inputUpdate = true;
    };

  }

  set y(y) {
    const oldY = this._y;
    this._y = y;
    if ( oldY !== y ) {
      this.dungeon.update();
    }
  }

  get y() {
    return this._y;
  }

  set x(x) {
    const oldX = this._x;
    this._x = x;
    if ( oldX !== x ) {
      this.dungeon.update();
    }
  }

  get x() {
    return this._x;
  }

  update() {
    const levelSize = this.dungeon.currentLevel.width;
    const index = this.x + levelSize * this.y;
    const world = this.dungeon.currentLevel.world;

    if (world[index] && world[index].damage) {
      this.health -= world[index].damage;
    }
  }

  draw(ctx) {
    const levelSize = this.dungeon.currentLevel.width;
    let index = this.x + levelSize * this.y;
    const world = this.dungeon.currentLevel.world;

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

    const [ rx, ry ] = this.dungeon.grid.calcContextPos(this.x, this.y);
    const size = this.dungeon.grid.gridSize;
    const offset = size * (1.0 - Player.PROPWIDTH) / 2;
    const width = size - 2 * offset;
    const height = size;

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
    const HEALTH_BAR_MARGIN = 5;
    const HEALTH_BAR_BACK_WIDTH = 100;
    const HEALTH_BAR_BACK_HEIGHT = 30;
    const HEALTH_BAR_WIDTH = HEALTH_BAR_BACK_WIDTH - HEALTH_BAR_MARGIN * 2;
    const HEALTH_BAR_HEIGHT = HEALTH_BAR_BACK_HEIGHT - HEALTH_BAR_MARGIN * 2;

    const TEXT_X = 6;
    const TEXT_Y_OFFSET = 10;

    ctx.fillStyle = '#444';
    ctx.fillRect(0, ctx.height - HEALTH_BAR_BACK_HEIGHT, HEALTH_BAR_BACK_WIDTH, HEALTH_BAR_BACK_HEIGHT);
    ctx.fillStyle = '#B55';
    ctx.fillRect(HEALTH_BAR_MARGIN, ctx.height - HEALTH_BAR_BACK_HEIGHT + HEALTH_BAR_MARGIN, HEALTH_BAR_WIDTH * (this.health / this.maxHealth), HEALTH_BAR_HEIGHT);
    ctx.fillStyle = 'white';
    ctx.font = '18px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`${this.health}`, TEXT_X, ctx.height - TEXT_Y_OFFSET, HEALTH_BAR_WIDTH);
  }

  drawGameOver(ctx) {
    const TEXT_PADDING = 10;

    const fontSize = ctx.width / Player.GAME_OVER_TEXT.length;
    ctx.textAlign = 'center';
    ctx.font = `${fontSize}px monospace`;

    let height = fontSize;
    let { width } = ctx.measureText(Player.GAME_OVER_TEXT);
    height += TEXT_PADDING;
    width += TEXT_PADDING;

    ctx.fillStyle = '#444';
    ctx.fillRect(ctx.width / 2 - width / 2, ctx.height / 2 - height * 0.8, width, height)
    ctx.fillStyle = 'white';
    ctx.fillText(Player.GAME_OVER_TEXT, ctx.width / 2, ctx.height / 2);
  }

}
