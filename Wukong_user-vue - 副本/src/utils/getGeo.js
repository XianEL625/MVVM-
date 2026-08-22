import { readFileSync, writeFileSync, existsSync } from 'fs';
import { feature } from 'topojson-client';

const jsonPath = 'src/assets/json/level.json';

if (!existsSync(jsonPath)) {
  console.error(`错误：文件 ${jsonPath} 不存在！`);
  process.exit(1);
}

let topoJson;
try {
  const rawData = readFileSync(jsonPath, 'utf8');
  topoJson = JSON.parse(rawData);
} catch (error) {
  console.error('文件解析失败:', error.message);
  process.exit(1);
}

function processNode(node, features = []) {
  // 处理当前节点
  if (node.payload?.objects) {
    const collection = node.payload.objects.collection;
    if (collection) {
      const featureData = feature(node.payload, collection);
      featureData.properties = {
        ...node.payload.properties,
        treeID: node.treeID,
        name: node.name,
        parent: node.parent,
        bbox: node.bbox,
        _flagEd: node._flagEd,
        level: node.payload.properties?.level,
        adcode: node.payload.properties?.adcode,
        center: node.payload.properties?.center,
        centroid: node.payload.properties?.centroid
      };
      features.push(featureData);
    }
  }

  // 递归处理子节点
  if (node.children) {
    Object.values(node.children).forEach(child => {
      processNode(child, features);
    });
  }

  return features;
}

const geoJson = {
  type: 'FeatureCollection',
  features: processNode(topoJson),
  bbox: topoJson.bbox,
  properties: {
    _flagEd: topoJson._flagEd,
    name: topoJson.name,
    adcode: topoJson.payload?.properties?.adcode
  }
};

try {
  writeFileSync('src/assets/json/level-geo.json', JSON.stringify(geoJson));
  console.log('转换成功，包含完整层级数据！');
  console.log('特征数量:', geoJson.features.length);
  console.log('样例数据:', JSON.stringify(geoJson.features[0], null, 2));
} catch (error) {
  console.error('文件写入失败:', error.message);
}