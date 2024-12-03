export interface GeoJSONLayer {
  id: string;
  name: string;
  data: GeoJSON.FeatureCollection;
  color: string;
  visible: boolean;
  opacity: number;
  type:
    | "Point"
    | "LineString"
    | "MultiLineString"
    | "Polygon"
    | "MultiPolygon"
    | "Unknown";
  isVoronoi?: boolean;
  isCluster?: boolean;
}

export interface TempLayer {
  id: string;
  name: string;
  data: GeoJSON.FeatureCollection;
  color: string;
  opacity: number;
  type:
    | "Point"
    | "LineString"
    | "MultiLineString"
    | "Polygon"
    | "MultiPolygon"
    | "Unknown";
}

declare global {
  interface Window {
    layers: GeoJSONLayer[];
    tempLayers: TempLayer[];
  }
}

declare module "@turf/turf" {
  export function buffer(
    geojson: GeoJSON.GeoJSON,
    radius: number,
    options?: {
      units: "meters" | "miles" | "kilometers" | "degrees" | "radians";
    }
  ): GeoJSON.GeoJSON;
}
