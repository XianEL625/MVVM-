import {
  BufferGeometry,
  Camera,
  ExtrudeGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Raycaster,
  Scene,
  Shape,
  TextureLoader,
  Vector2,
} from "three";
import MapData from "../../../assets/json/map.json";
import { geoMercator } from "d3-geo";
import { AnimateMarker } from "./AnimateMarker";
import cautionSprite from "../../../assets/images/breath_red.png";
import { emitter } from "../../../utils/mitt";

// 加载器
const loader = new TextureLoader();
const animateTexture = loader.load(cautionSprite);

type NumberArray = [number, number];

// 转换函数
export const projection = geoMercator()
  .center([104.065735, 30.659462])
  .translate([0, 0]);

// 创建mesh，line
const createShape = (points: NumberArray[]) => {
  const path: Vector2[] = [];

  points.forEach((item) => {
    const [x, y] = projection(item) as NumberArray;
    path.push(new Vector2(x, -y));
  });

  const shape = new Shape(path);

  const geometry = new ExtrudeGeometry(shape, {
    bevelEnabled: false,
    depth: 5,
  });
  const material = new MeshBasicMaterial({
    color: "#2e317c",
    opacity: 0.8,
    transparent: true,
  });
  const mesh = new Mesh(geometry, material);
  const linegeometry = new BufferGeometry().setFromPoints(path);
  const linematerial = new LineBasicMaterial({
    color: "#ffffff",
    linewidth: 3,
  });
  const line = new Line(linegeometry, linematerial);
  line.position.z = 6;

  return { mesh, line };
};

class Map {
  pointer: Vector2;
  private raycaster: Raycaster;
  currentMesh: Mesh[];
  constructor(
    protected readonly scene: Scene,
    protected readonly camera: Camera
  ) {
    this.pointer = new Vector2();
    this.raycaster = new Raycaster();
    this.currentMesh = [];

    window.addEventListener("pointermove", this.onPointerMove.bind(this));
  }

  private onPointerMove(event: PointerEvent) {
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);

    if (this.currentMesh.length) {
      for (let index = 0; index < this.currentMesh.length; index++) {
        (this.currentMesh[index].material as MeshBasicMaterial).color.set(
          "#2e317c"
        );
      }
    }

    const intersects = this.raycaster.intersectObjects(this.scene.children);
    if (!intersects.length) {
      emitter.emit("hoverMap", false);
    }
    this.currentMesh = [];
    for (let index = 0; index < intersects.length; index++) {
      if (
        intersects[index].object.type === "Mesh" &&
        !intersects[index].object.userData.isAnimateMarker
      ) {
        const mesh = intersects[index].object as Mesh;
        emitter.emit("hoverMap", {
          x: event.clientX,
          y: event.clientY,
          data: mesh.userData,
        });
        this.currentMesh.push(mesh);
        (mesh.material as MeshBasicMaterial).color.set("#22a2c3");
      }
    }
  }

  create() {
    const objectGroup = new Object3D();
    MapData.features.forEach((item) => {
      const { coordinates, type } = item.geometry;
      const { properties } = item;
      if (["MultiPolygon"].includes(type)) {
        coordinates.forEach((v) => {
          v.forEach((j) => {
            const { mesh, line } = createShape(j as NumberArray[]);
            mesh.userData = properties;
            objectGroup.add(mesh, line);
          });
        });
      } else {
        coordinates.forEach((v) => {
          const { mesh, line } = createShape(v as NumberArray[]);
          mesh.userData = properties;
          objectGroup.add(mesh, line);
        });
      }
    });

    this.scene.add(objectGroup);
  }

  createAnimateMarker() {
    const animateMarker = new AnimateMarker(
      {
        texture: animateTexture,
        tilesHoriz: 23,
        tilesVert: 1,
        numTiles: 23,
        tileDispDuration: 75,
      },
      10,
      this.camera
    );

    return animateMarker;
  }
}

export { Map };
