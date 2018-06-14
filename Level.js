
import { vec } from './Vector.js'
import { Room } from './Room.js'

export class Level {

  constructor(dungeon) {
    this.dungeon = dungeon;
    this.world = [];
    this._generateLevel();
  }

  _isOccupied(width, height, pos) {
    return (room) => {
      return ((Math.abs(room.pos.x - pos.x) * 2 < (room.width + width)) &&
         (Math.abs(room.pos.y - pos.y) * 2 < (room.height + height)));
    };
  }

  _maxWidth(rooms)  {
    return rooms.map(r => r.pos.x + r.width).reduce((max, current) => current > max ? current : max, 0);
  }

  _maxHeight(rooms)  {
    return rooms.map(r => r.pos.y + r.height).reduce((max, current) => current > max ? current : max, 0);
  }

  _generatePosition(rooms, width, height) {
    const maxWidth = this._maxWidth(rooms);
    const maxHeight = this._maxHeight(rooms);

    let pos;
    let isOccupied;
    do {
      const x = Math.trunc(Math.random() * (maxWidth + width));
      const y = Math.trunc(Math.random() * (maxHeight + height));
      pos = vec(x, y);
      isOccupied = this._isOccupied(width, height, pos);
    } while(rooms.find(isOccupied));

    return pos;
  }

  _applyRoom(maxWidth) {
    return (room) => {
      for (let y = 0; y < room.height; y++ ) {
        const wy = room.pos.y + y;
        for (let x = 0; x < room.width; x++ ) {
          const wx = room.pos.x + x;
          this.world[wx + wy * maxWidth] = room.tiles[ x + y * room.width];
        }
      }
    };
  }

  _generateLevel() {
    const roomCount = 4;
    const rooms = [];

    for (let i = 0; i < roomCount; i++) {
      const width = Math.trunc(Math.random() * 10 + 5);
      const height = Math.trunc(Math.random() * 10 + 5);
      const pos = this._generatePosition(rooms, width, height);

      let room = new Room(width, height, pos);
      room.generateRoom();
      rooms.push(room);
    }

    const maxWidth = this._maxWidth(rooms);
    const maxHeight = this._maxHeight(rooms);

    this.width = maxWidth;
    this.height = maxHeight;

    const applyRoom = this._applyRoom(maxWidth);
    rooms.forEach(applyRoom);

    let idx = this.world.findIndex(tile => tile && !tile.solid);
    const x = idx % this.width;
    const y = Math.floor(idx / this.width);
    this.spawn = vec(x, y);
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
