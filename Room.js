
import { rooms } from './rooms.js'

export class Room {

  constructor(width, height, pos) {
    this.width = width;
    this.height = height;
    this.pos = pos;
    this.tiles = [];
  }

  generateRoom() {
    let generator = rooms[Math.trunc(Math.random() * rooms.length)];
    generator.apply(this);
  }

}
