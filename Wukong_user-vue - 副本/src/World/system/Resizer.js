import { PerspectiveCamera, WebGLRenderer } from 'three';

class Resizer {
  constructor(container, camera, renderer) {
    this.handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
    };

    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }
}

export { Resizer };