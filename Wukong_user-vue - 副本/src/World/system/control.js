import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const createControl = (camera, canvas) => {
  const controls = new OrbitControls(camera, canvas);
  
  controls.enableDamping = true;
  
  // 更安全的 tick 方法绑定
  controls.tick = () => controls.update();
  
  return controls;
};

export { createControl };