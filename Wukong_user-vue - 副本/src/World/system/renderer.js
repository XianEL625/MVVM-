import { WebGLRenderer } from "three";

const createRenderer = () => {
  const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true
  });
  return renderer;
};

export { createRenderer };