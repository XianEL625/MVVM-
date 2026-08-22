import { PerspectiveCamera } from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const createControl = (camera: PerspectiveCamera, canvas: HTMLElement) => {
  const controls = new OrbitControls(camera, canvas);

  controls.enableDamping = true;

  Object.assign(controls, {
    tick: controls.update,
  });

  return controls;
};

export { createControl };
