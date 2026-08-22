/*
 * @Date: 2023-02-27 21:47:02
 * @LastEditors: z-god 1476482763@qq.com
 * @LastEditTime: 2023-02-27 22:40:05
 * @FilePath: \wed3d-worldh:\project\three-map\src\World\system\scene.ts
 */
import { Color, Scene } from "three";

// 创建场景
const createScene = () => {
  const scene = new Scene();

  scene.background = new Color("#baccd9");

  return scene;
};

export { createScene };
