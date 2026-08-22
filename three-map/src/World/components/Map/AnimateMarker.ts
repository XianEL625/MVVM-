/*
 * @Date: 2023-03-01 20:05:28
 * @LastEditors: z-god 1476482763@qq.com
 * @LastEditTime: 2023-03-10 19:11:18
 * @FilePath: \wed3d-worldh:\project\three-map\src\World\components\Map\AnimateMarker.ts
 */
import {
  MeshBasicMaterial,
  DoubleSide,
  PlaneGeometry,
  Mesh,
  Texture,
  Camera,
} from "three";
import { TextureAnimator } from "./TextureAnimator";
import { projection } from ".";

class AnimateMarker {
  annie: TextureAnimator;
  mesh: Mesh<PlaneGeometry, MeshBasicMaterial>;
  constructor(
    animateProps: {
      texture: Texture;
      tilesHoriz: number;
      tilesVert: number;
      numTiles: number;
      tileDispDuration: number;
      milliSec?: number;
    },
    size = 25,
    private camera: Camera
  ) {
    const {
      texture,
      tilesHoriz,
      tilesVert,
      numTiles,
      tileDispDuration,
      milliSec,
    } = animateProps;
    this.annie = new TextureAnimator(
      texture,
      tilesHoriz,
      tilesVert,
      numTiles,
      tileDispDuration,
      milliSec
    ); // texture, #horiz, #vert, #total, duration.
    const annieMaterial = new MeshBasicMaterial({
      map: texture,
      side: DoubleSide,
      transparent: true,
    });
    const annieGeometry = new PlaneGeometry(size, size, 1, 1);
    this.mesh = new Mesh(annieGeometry, annieMaterial);
    this.mesh.userData.isAnimateMarker = true;
    this.mesh.visible = false;
  }

  setPosition(data: [number, number], z = 2) {
    const [x, y] = projection(data) as [number, number];
    this.mesh.position.set(x, -y, z);
    this.mesh.visible = true;
    return { x, y };
  }
}

export { AnimateMarker };
