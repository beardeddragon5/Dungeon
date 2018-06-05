
export class Grid {

  static get PADDING() { const g = 3; return g; }

  constructor(gridSize) {
    this.gridSize = gridSize;
    this.offset = { x: 100, y: 100 };
  }

  drawColor(ctx, x, y, color) {
    ctx.fillStyle = color;

    const [ rx, ry ] = this.calcContextPos(x, y);
    ctx.fillRect(rx, ry, this.gridSize + Grid.PADDING, this.gridSize + Grid.PADDING);
  }

  calcContextPos(gridX, gridY) {
    return [
      this.offset.x + (gridX * this.gridSize),
      this.offset.y + (gridY * this.gridSize)
    ];
  }
}
