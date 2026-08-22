import { MeshBasicMaterial, DoubleSide, PlaneGeometry, Mesh } from 'three';
import { TextureAnimator } from './TextureAnimator';
import { projection } from '.';

class AnimateMarker {
  constructor(animateProps, size = 25, camera) {
    const {
      texture,
      tilesHoriz,
      tilesVert,
      numTiles,
      tileDispDuration,
      milliSec
    } = animateProps;
    this.annie = new TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration, milliSec);
    const annieMaterial = new MeshBasicMaterial({
      map: texture,
      side: DoubleSide,
      transparent: true
    });
    const annieGeometry = new PlaneGeometry(size, size, 1, 1);
    this.mesh = new Mesh(annieGeometry, annieMaterial);
    this.mesh.userData.isAnimateMarker = true;
    this.mesh.visible = false;
    this.camera = camera;
  }

  setPosition(data, z = 2) {
    const [x, y] = projection(data);
    this.mesh.position.set(x, -y, z);
    this.mesh.visible = true;
    return { x, y };
  }
}

export { AnimateMarker };