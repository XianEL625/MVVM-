/*
 * @Date: 2023-02-27 21:45:46
 * @LastEditors: z-god 1476482763@qq.com
 * @LastEditTime: 2023-03-08 14:31:52
 * @FilePath: \wed3d-worldh:\project\three-map\src\World\system\camera.ts
 */
import { PerspectiveCamera } from "three";

// 创建相机
const createCamera = () => {
  const camera = new PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0,0, 250);

  return camera;
};

export { createCamera };
