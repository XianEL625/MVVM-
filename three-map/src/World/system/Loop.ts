import { Camera, Clock, Scene, WebGLRenderer } from "three";

const clock = new Clock();

export interface UpdateItem {
  tick?: (delta: number) => void;
}

class Loop {
  public updateList: UpdateItem[];
  constructor(
    private camera: Camera,
    private scene: Scene,
    private renderer: WebGLRenderer
  ) {
    this.updateList = [];
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      this.tick();

      this.renderer.render(this.scene, this.camera);
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick() {
    const delta = clock.getDelta();

    for (const obj of this.updateList) {
      if (obj.tick) {
        obj.tick(delta);
      }
    }
  }
}

export { Loop };
