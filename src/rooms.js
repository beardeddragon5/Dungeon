
import { Tiles } from './Tiles.js';

function normalRoom() {
  for (let x = 0; x < this.width; x++) {
    this.tiles[x] = Tiles.WALL;
    this.tiles[x + this.width * (this.height - 1)] = Tiles.WALL;
  }
  for (let y = 0; y < this.height; y++) {
    this.tiles[y * this.width] = Tiles.WALL;
    this.tiles[y * this.width + this.width - 1] = Tiles.WALL;
  }
  for (let i = 0; i < this.width * this.height; i++) {
    if (!this.tiles[i]) {
      this.tiles[i] = Tiles.FLOOR;
    }
  }
}

normalRoom.canSpawn = true;

export const rooms = [
  normalRoom
];
