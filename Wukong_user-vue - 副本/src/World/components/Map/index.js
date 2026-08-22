import {
  BufferGeometry,
  Camera,
  CircleGeometry,
  ExtrudeGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Raycaster,
  RingGeometry,
  Scene,
  Shape,
  Vector2,
  DoubleSide
} from 'three';
import { geoMercator } from 'd3-geo';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import * as THREE from 'three';
import LevelMapData from '../../../assets/json/level-geo.json';
import { gsap } from 'gsap';

const mapConfig = {
  spotZIndex: 10,
  spotColor: '#3EC5FB'
};

export const projection = geoMercator()
  .center([104.065735, 30.659462])
  .translate([0, 0]);

export function drawSpot(coord) {
  if (!coord || !coord.length) return null;

  const [x, y] = projection(coord);
  
  const spotGeometry = new CircleGeometry(0.2, 200);
  const spotMaterial = new MeshBasicMaterial({
    color: mapConfig.spotColor,
    side: DoubleSide,
  });
  const circle = new Mesh(spotGeometry, spotMaterial);
  circle.position.set(x, -y, mapConfig.spotZIndex);

  const ringGeometry = new RingGeometry(0.2, 0.3, 50);
  const ringMaterial = new MeshBasicMaterial({
    color: mapConfig.spotColor,
    side: DoubleSide,
    transparent: true,
  });
  const ring = new Mesh(ringGeometry, ringMaterial);
  ring.position.set(x, -y, mapConfig.spotZIndex);

  return { circle, ring };
}

const createShape = (points) => {
  const path = [];

  points.forEach((item) => {
    const [x, y] = projection(item);
    path.push(new Vector2(x, -y));
  });

  const shape = new Shape(path);

  const geometry = new ExtrudeGeometry(shape, {
    bevelEnabled: false,
    depth: 5
  });
  const material = new MeshBasicMaterial({
    color: '#2e317c',
    opacity: 0.8,
    transparent: true
  });
  const mesh = new Mesh(geometry, material);
  const linegeometry = new BufferGeometry().setFromPoints(path);
  const linematerial = new LineBasicMaterial({
    color: '#ffffff',
    linewidth: 3
  });
  const line = new Line(linegeometry, linematerial);
  line.position.z = 6;

  return { mesh, line };
};

const calculateZoom = (coordinates, type, camera, isCityLevel = false) => {
  let points = [];
  if (type === 'MultiPolygon') {
    coordinates.forEach(polygon => {
      polygon.forEach(ring => {
        points.push(...ring);
      });
    });
  } else if (type === 'Polygon') {
    points.push(...coordinates[0]);
  }

  if (points.length === 0) return 300;

  const projectedPoints = points.map(p => projection(p));
  const xValues = projectedPoints.map(p => p[0]);
  const yValues = projectedPoints.map(p => p[1]);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  const width = maxX - minX;
  const height = maxY - minY;
  const maxDim = Math.max(width, height);

  const fov = camera.fov * (Math.PI / 180);
  const aspect = camera.aspect;
  let z = (maxDim / 2) / Math.tan(fov / 2) / aspect * 2.0;
  if (isCityLevel) {
    z = z / 2;
  }
  return Math.max(z, 30);
};

class Map {
  constructor(scene, camera, domContainer) {
    this.pointer = new Vector2();
    this.raycaster = new Raycaster();
    this.currentMesh = [];
    this.scene = scene;
    this.camera = camera;
    this.currentLevel = 'province';
    this.currentProvince = null;
    this.historyGroup = [];
    this.domContainer = domContainer;
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(domContainer.clientWidth, domContainer.clientHeight);
    this.labelRenderer.domElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 100;
    `;
    document.body.appendChild(this.labelRenderer.domElement);
    this.labelGroup = new THREE.Object3D();
    scene.add(this.labelGroup);
    this.lastClickTime = 0;
    this.clickCount = 0;
    window.addEventListener('pointermove', this.onPointerMove.bind(this));
    domContainer.addEventListener('click', this.onClick.bind(this));
  }

  onClick(event) {
    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - this.lastClickTime;

    if (timeSinceLastClick < 300) {
      this.clickCount++;
    } else {
      this.clickCount = 1;
    }
    this.lastClickTime = currentTime;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    
    if (intersects.length > 0) {
      const mesh = intersects[0].object;
      if (this.currentLevel === 'province' && mesh.userData?.adcode) {
        const clickPoint = intersects[0].point;
        this.drillDown(mesh.userData, clickPoint);
      }
    } else {
      if (this.currentLevel === 'city' && this.clickCount >= 2) {
        this.drillUp();
        this.clickCount = 0;
      }
    }
  }

  async drillDown(provinceData, clickPoint) {
    console.log('Drilling down to province:', provinceData.name, 'adcode:', provinceData.adcode);
    this.historyGroup.push(this.currentGroup);
    this.currentGroup = new THREE.Object3D();
    this.currentProvince = provinceData;
    this.currentLevel = 'city';
    
    while (this.labelGroup.children.length > 0) {
      this.labelGroup.remove(this.labelGroup.children[0]);
    }
    this.labelGroup.visible = false; // 隐藏标签直到动画完成
    
    const cityFeatures = LevelMapData.features.reduce((acc, f) => {
      if (f.type === 'FeatureCollection') {
        const filteredCities = f.features.filter(city => {
          let parentAdcode;
          try {
            if (typeof city.properties.parent === 'string') {
              const parsedParent = JSON.parse(city.properties.parent);
              parentAdcode = parsedParent.adcode;
            } else {
              parentAdcode = city.properties.parent?.adcode;
            }
          } catch (e) {
            console.warn('Failed to parse parent for city:', city.properties.name, e);
            return false;
          }
          
          const matchesParent = parentAdcode === provinceData.adcode;
          return matchesParent && city.properties.level === 'city';
        });
        return acc.concat(filteredCities);
      }
      return acc;
    }, []);
    
    console.log(`Found ${cityFeatures.length} cities for ${provinceData.name}`);

    if (cityFeatures.length === 0) {
      console.warn(`No cities found for ${provinceData.name}, rendering province boundary`);
      const provinceFeature = LevelMapData.features.find(f => 
        f.properties?.adcode === provinceData.adcode
      );
      if (provinceFeature) {
        const { coordinates, type } = provinceFeature.geometry;
        const { properties } = provinceFeature;
        if (['MultiPolygon', 'Polygon'].includes(type)) {
          coordinates.forEach(polygon => {
            polygon.forEach(ring => {
              const { mesh, line } = createShape(ring);
              mesh.userData = properties;
              this.currentGroup.add(mesh, line);
            });
          });
        }
      }
    } else {
      cityFeatures.forEach(item => {
        const { coordinates, type } = item.geometry;
        const { properties } = item;

        if (['MultiPolygon', 'Polygon'].includes(type)) {
          coordinates.forEach(polygon => {
            polygon.forEach(ring => {
              const { mesh, line } = createShape(ring);
              mesh.userData = properties;
              this.currentGroup.add(mesh, line);
            });
          });
        }
      });
    }

    const provinceFeature = LevelMapData.features.find(f => 
      f.properties?.adcode === provinceData.adcode
    );
    const zoom = provinceFeature
      ? calculateZoom(provinceFeature.geometry.coordinates, provinceFeature.geometry.type, this.camera, true)
      : 300;

    this.currentGroup.scale.set(1, 1, 1);
    const originalPosition = this.currentGroup.position.clone();
    if (clickPoint) {
      this.currentGroup.position.set(
        clickPoint.x,
        clickPoint.y,
        clickPoint.z
      );
    }

    gsap.to(this.camera.position, {
      x: clickPoint ? clickPoint.x : 0,
      y: clickPoint ? clickPoint.y : 0,
      z: zoom,
      duration: 1
    });
    gsap.to(this.currentGroup.scale, {
      x: 4,
      y: 4,
      z: 1,
      duration: 1,
      onComplete: () => {
        this.currentGroup.position.copy(originalPosition);
        this.scene.remove(this.historyGroup[this.historyGroup.length - 1]);
        this.scene.add(this.currentGroup);
        // 在动画完成后添加标签
        if (cityFeatures.length === 0 && provinceFeature) {
          this.createProvinceMarkers(provinceFeature, this.currentGroup);
        } else {
          cityFeatures.forEach(item => {
            this.createCityMarkers(item.properties, this.currentGroup);
          });
        }
        this.labelGroup.scale.set(4, 4, 1); // 直接设置最终比例
        this.labelGroup.visible = true; // 显示标签
      }
    });
  }

  drillUp() {
    if (this.historyGroup.length === 0) return;
    
    this.currentLevel = 'province';
    this.scene.remove(this.currentGroup);
    this.currentGroup = this.historyGroup.pop();
    this.currentProvince = null;
    
    while (this.labelGroup.children.length > 0) {
      this.labelGroup.remove(this.labelGroup.children[0]);
    }
    this.labelGroup.visible = false; // 隐藏标签直到动画完成
    
    const provinceFeatures = this.extractProvinceFeatures(LevelMapData.features);
    
    const chinaFeature = LevelMapData.features.find(f => f.properties.level === 'country');
    const zoom = chinaFeature
      ? calculateZoom(chinaFeature.geometry.coordinates, chinaFeature.geometry.type, this.camera)
      : 300;

    this.currentGroup.scale.set(1, 1, 1);

    gsap.to(this.camera.position, {
      x: 0,
      y: 0,
      z: zoom,
      duration: 1
    });
    gsap.to(this.currentGroup.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1,
      onComplete: () => {
        this.scene.add(this.currentGroup);
        // 在动画完成后添加标签
        provinceFeatures.forEach(feature => {
          this.createProvinceMarkers(feature, this.currentGroup);
        });
        this.labelGroup.scale.set(1, 1, 1); // 直接设置最终比例
        this.labelGroup.visible = true; // 显示标签
      }
    });
  }

  onPointerMove(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);

    if (this.currentMesh.length) {
      for (let index = 0; index < this.currentMesh.length; index++) {
        this.currentMesh[index].material.color.set('#2e317c');
      }
    }

    const intersects = this.raycaster.intersectObjects(this.scene.children);
    this.currentMesh = [];
    for (let index = 0; index < intersects.length; index++) {
      if (intersects[index].object.type === 'Mesh' && !intersects[index].object.userData.isMarker) {
        const mesh = intersects[index].object;
        this.currentMesh.push(mesh);
        mesh.material.color.set('#22a2c3');
      }
    }
  }

  extractProvinceFeatures(features) {
    const provinces = features.flatMap(feature => {
      if (feature.type === 'FeatureCollection') {
        return this.extractProvinceFeatures(feature.features);
      }
      if (feature.properties?.level === 'province' && feature.properties.adcode) {
        return feature;
      }
      return [];
    });
    console.log('Extracted provinces:', provinces.map(p => ({
      name: p.properties.name,
      adcode: p.properties.adcode
    })));
    return provinces;
  }

  create() {
    this.currentGroup = new Object3D();
    
    const provinceFeatures = this.extractProvinceFeatures(LevelMapData.features);
    
    provinceFeatures.forEach((item) => {
      this.createProvinceMarkers(item, this.currentGroup);
      const { coordinates, type } = item.geometry;
      const { properties } = item;

      if (type === 'MultiPolygon') {
        coordinates.forEach((polygon) => {
          polygon.forEach((ring) => {
            const { mesh, line } = createShape(ring);
            mesh.userData = properties;
            this.currentGroup.add(mesh, line);
          });
        });
      } else if (type === 'Polygon') {
        coordinates.forEach((ring) => {
          const { mesh, line } = createShape(ring);
          mesh.userData = properties;
          this.currentGroup.add(mesh, line);
        });
      }
    });

    this.scene.add(this.currentGroup);
  }

  createProvinceMarkers(feature, group) {
    const { properties } = feature;
    const coord = properties.centroid || properties.center;
    if (!coord) return;

    const markers = drawSpot(coord);
    if (markers) {
      markers.circle.userData = {
        type: 'provinceMarker',
        provinceData: properties,
        isMarker: true
      };
      markers.ring.userData = {
        type: 'provinceMarkerRing',
        provinceData: properties,
        isMarker: true
      };
      group.add(markers.circle);
      group.add(markers.ring);
    }

    const label = this.createLabel(properties.name, coord, 'province-label');
    this.labelGroup.add(label);
  }

  createCityMarkers(properties, group) {
    const coord = properties.centroid || properties.center;
    if (!coord) return;

    const markers = drawSpot(coord);
    if (markers) {
      markers.circle.userData = {
        type: 'cityMarker',
        cityData: properties,
        isMarker: true
      };
      markers.ring.userData = {
        type: 'cityMarkerRing',
        cityData: properties,
        isMarker: true
      };
      group.add(markers.circle);
      group.add(markers.ring);
    }

    const label = this.createLabel(properties.name, coord, 'city-label');
    this.labelGroup.add(label);
  }

  createLabel(name, coord, className) {
    const labelDiv = document.createElement('div');
    labelDiv.textContent = name;
    labelDiv.className = className;
    labelDiv.style.cssText = `
      color: ${className === 'city-label' ? 'white' : 'white'};
      font-size: ${className === 'city-label' ? '10px' : '12px'};
      text-shadow: 0 0 5px black;
    `;
    
    const [x, y] = projection(coord);
    const label = new CSS2DObject(labelDiv);
    label.position.set(x, -y, 5);
    return label;
  }

  renderLabels() {
    this.labelRenderer.render(this.scene, this.camera);
  }
}

export { Map };