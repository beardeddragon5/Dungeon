import { vec } from './Vector.js';
import * as keyboard from './util/keyboard.js';

export class Player {

  /* eslint-disable no-magic-numbers */
  static get PROPWIDTH() { return 0.7; }
  static get INPUT_UPDATE_INTERVAL() { return 150; }
  static get GAME_OVER_TEXT() { return 'GAM3 0V3R'; }
  static get VELOCITY() { return 4; }
  /* eslint-enable no-magic-numbers */

  constructor(dungeon, x, y) {
    this.dungeon = dungeon;
    this.inventory = [];
    this.pos = vec(x, y);
    this.maxHealth = 100;
    this.health = 100;
    this.acceptInput = true;

    this.newPos = this.pos.clone();

    const onKeyDown = (e) => {
      const levelSize = this.dungeon.currentLevel.width;
      const currentPosition = Math.trunc(this.newPos.x) + levelSize * Math.trunc(this.newPos.y);
      const level = this.dungeon.currentLevel;

      let update = true;
      switch(e.keyCode) {
      case keyboard.W:
        if (!level.tile(currentPosition - levelSize).solid) {
          this.acceptInput = false;
          this.newPos.y--;
        }
        break;
      case keyboard.S:
        if (!level.tile(currentPosition + levelSize).solid) {
          this.acceptInput = false;
          this.newPos.y++;
        }
        break;
      case keyboard.A:
        if (!level.tile(currentPosition - 1).solid) {
          this.acceptInput = false;
          this.newPos.x--;
        }
        break;
      case keyboard.D:
        if (!level.tile(currentPosition + 1).solid) {
          this.acceptInput = false;
          this.newPos.x++;
        }
        break;
      default:
        update = false;
        break;
      }
      if (update) {
        this.dungeon.update();
      }
    };

    window.onkeydown = (e) => {
      if (this.acceptInput) {
        onKeyDown(e);
      }
    };
  }

  update() {
    const levelSize = this.dungeon.currentLevel.width;
    const index = this.newPos.x + levelSize * this.newPos.y;
    const world = this.dungeon.currentLevel.world;

    if (world[index] && world[index].damage) {
      this.health -= world[index].damage;
    }
  }

  draw(ctx, tpf) {
    const deltaX = this.newPos.clone().sub(this.pos);
    this.pos.add( deltaX.normalize().scale( Player.VELOCITY * tpf ) );

    const afterDelta = this.newPos.clone().sub(this.pos);
    const cross = Math.sign(deltaX.cross(afterDelta));

    // check if player is at new specific position
    // eslint-disable-next-line no-magic-numbers
    if (Object.is(cross, -0) || Object.is(cross, -1)) {
      this.acceptInput = true;
      this.pos = this.newPos.clone();
    }

    this.dungeon.grid.offset.x = ctx.width / 2 - this.pos.x * this.dungeon.grid.gridSize;
    this.dungeon.grid.offset.y = ctx.height / 2 - this.pos.y * this.dungeon.grid.gridSize;

    const [ rx, ry ] = this.dungeon.grid.calcContextPos(this.pos.x, this.pos.y);
    const tileSize = this.dungeon.grid.gridSize;

    const offset = tileSize * (1.0 - Player.PROPWIDTH) / 2;
    const width = tileSize * Player.PROPWIDTH;
    const height = tileSize;

    ctx.fillStyle = 'brown';
    ctx.fillRect(rx + offset, ry - offset, width, height);

    this.drawHealth(ctx);

    if (this.health <= 0) {
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
    const TEXT_OFFSET = 0.8;

    const fontSize = ctx.width / Player.GAME_OVER_TEXT.length;
    ctx.textAlign = 'center';
    ctx.font = `${fontSize}px monospace`;

    let height = fontSize;
    let { width } = ctx.measureText(Player.GAME_OVER_TEXT);
    height += TEXT_PADDING;
    width += TEXT_PADDING;

    ctx.fillStyle = '#444';

    ctx.fillRect(ctx.width / 2 - width / 2, ctx.height / 2 - height * TEXT_OFFSET, width, height);
    ctx.fillStyle = 'white';
    ctx.fillText(Player.GAME_OVER_TEXT, ctx.width / 2, ctx.height / 2);
  }

}
