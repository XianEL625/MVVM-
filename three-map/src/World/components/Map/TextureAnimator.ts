/*
 * @Date: 2023-03-01 20:05:28
 * @LastEditors: z-god 1476482763@qq.com
 * @LastEditTime: 2023-03-10 18:57:16
 * @FilePath: \wed3d-worldh:\project\three-map\src\World\components\Map\TextureAnimator.ts
 */
import { RepeatWrapping, Texture } from "three";

class TextureAnimator {
  tilesHorizontal: number;
  tilesVertical: number;
  numberOfTiles: number;
  tileDisplayDuration: number;
  currentDisplayTime: number;
  currentTile: number;
  update: (milliSec: number) => void;
  constructor(
    texture: Texture,
    tilesHoriz: number,
    tilesVert: number,
    numTiles: number,
    tileDispDuration: number,
    public milliSec = 1000
  ) {
    this.tilesHorizontal = tilesHoriz;
    this.tilesVertical = tilesVert;
    this.numberOfTiles = numTiles;
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);

    this.tileDisplayDuration = tileDispDuration;

    this.currentDisplayTime = 0;

    this.currentTile = 0;

    this.update = (milliSec: number) => {
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

  tick(delta: number) {
    this.update(delta * this.milliSec);
  }
}

export { TextureAnimator };
