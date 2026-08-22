
import { RepeatWrapping, Texture } from 'three';

class TextureAnimator {
  constructor(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration, milliSec = 1000) {
    this.tilesHorizontal = tilesHoriz;
    this.tilesVertical = tilesVert;
    this.numberOfTiles = numTiles;
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);

    this.tileDisplayDuration = tileDispDuration;

    this.currentDisplayTime = 0;

    this.currentTile = 0;

    this.update = (milliSec) => {
      this.currentDisplayTime += milliSec;
      while (this.currentDisplayTime > this.tileDisplayDuration) {
        this.currentDisplayTime -= this.tileDisplayDuration;
        this.currentTile++;
        if (this.currentTile == this.numberOfTiles) this.currentTile = 0;
        const currentColumn = this.currentTile % this.tilesHorizontal;
        texture.offset.x = currentColumn / this.tilesHorizontal;
        const currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
        texture.offset.y = currentRow / this.tilesVertical;
      }
    };
  }

  tick(delta) {
    this.update(delta * this.milliSec);
  }
}

export { TextureAnimator };