// types.js (通用JS类型定义)
/**
 * @typedef {Object} GeoJsonType
 * @property {"FeatureCollection"} type
 * @property {GeoJsonFeature[]} features
 */

/**
 * @typedef {Object} GeoJsonFeature
 * @property {"Feature"} type
 * @property {GeoJsonProperties} properties
 * @property {GeoJsonGeometry} geometry
 * @property {any[][]} vector3
 */

/**
 * @typedef {Object} GeoJsonProperties
 * @property {number} adcode
 * @property {string} name
 * @property {[number, number]} center
 * @property {[number, number]} centroid
 * @property {number} childrenNum
 * @property {Geolevel} level
 * @property {GeoParent} parent
 * @property {number} subFeatureIndex
 * @property {number[]} acroutes
 * @property {null} adchar
 */

/**
 * @typedef {"province" | "city" | "district"} Geolevel
 */

/**
 * @typedef {Object} GeoParent
 * @property {number} adcode
 */

/**
 * @typedef {Object} GeoJsonGeometry
 * @property {GeometryType} type
 * @property {GeometryCoordinates} coordinates
 */

/**
 * @typedef {"Point" | "LineString" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon" | "GeometryCollection"} GeometryType
 */

/**
 * @template {GeometryType} T
 * @typedef {T extends "Point" ? [number, number] :
*           T extends "LineString" ? [number, number][] :
*           T extends "Polygon" ? [number, number][][] :
*           T extends "MultiPoint" ? [number, number][] :
*           T extends "MultiLineString" ? [number, number][][] :
*           T extends "MultiPolygon" ? [number, number][][][] :
*           T extends "GeometryCollection" ? any : never} GeometryCoordinates
*/

/**
* @typedef {Object} ExtendObject3D
* @property {any} customProperties
* @extends THREE.Object3D
*/