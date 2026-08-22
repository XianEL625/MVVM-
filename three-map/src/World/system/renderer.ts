/*
 * @Date: 2023-03-01 20:05:28
 * @LastEditors: z-god 1476482763@qq.com
 * @LastEditTime: 2023-03-10 19:54:34
 * @FilePath: \wed3d-worldh:\project\three-map\src\World\system\renderer.ts
 */
import { WebGLRenderer } from "three";

const createRenderer = () => {
  const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true
  });
  return renderer;
};

export { createRenderer };
