
import { vec } from './Vector.js';
import { Room } from './Room.js';
import { randInt } from './util/random.js';
import { Tiles } from './Tiles.js';

export class Level {

  constructor(dungeon) {
    this.dungeon = dungeon;
    this.world = [];
    this._generateLevel();
  }

  /**
   *
   * @param {number} index
   * @returns Tile
   */
  tile(index) {
    if (index < 0) {
      return Tiles.VOID;
    } else if (index >= this.world.length) {
      return Tiles.VOID;
    } else {
      return this.world[index] || Tiles.VOID;
    }
  }

  _isOccupied(width, height, pos) {
    return (room) => {
      return ((Math.abs(room.pos.x - pos.x) * 2 < (room.width + width)) &&
         (Math.abs(room.pos.y - pos.y) * 2 < (room.height + height)));
    };
  }

  _maxWidth(rooms) {
    return rooms.map(r => r.pos.x + r.width).reduce((max, current) => current > max ? current : max, 0);
  }

  _maxHeight(rooms) {
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
    console.log('Generate Level ...');
    const roomMinDim = { width: 5, height: 5 };
    const roomMaxDim = { width: 15, height: 15 };
    const roomCount = 4;
    const rooms = [];

    for (let i = 0; i < roomCount; i++) {
      const width = randInt(roomMinDim.width, roomMaxDim.width);
      const height = randInt(roomMinDim.height, roomMaxDim.height);
      const pos = this._generatePosition(rooms, width, height);

      const room = new Room(width, height, pos);
      room.generateRoom();
      rooms.push(room);
    }

    const maxWidth = this._maxWidth(rooms);
    const maxHeight = this._maxHeight(rooms);

    this.width = maxWidth;
    this.height = maxHeight;

    const applyRoom = this._applyRoom(maxWidth);
    rooms.forEach(applyRoom);

    const idx = this.world.findIndex(tile => tile && !tile.solid);
    const x = idx % this.width;
    const y = Math.floor(idx / this.width);
    this.spawn = vec(x, y);
    console.log('Level Generated');
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
