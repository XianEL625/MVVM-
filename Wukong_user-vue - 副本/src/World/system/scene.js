import { Color, Scene } from "three";

const createScene = () => {
  const scene = new Scene();

  scene.background = new Color("#baccd9");

  return scene;
};

export { createScene };