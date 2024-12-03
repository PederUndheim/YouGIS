import React, { useRef, useEffect, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  useLayerDataContext,
  useLayerActionContext,
} from "../../context/LayerContext";
import { FeatureCollection, Geometry } from "geojson";
import { GeoJSONLayer } from "../../types";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

interface MapContainerProps {
  style?: React.CSSProperties;
  drawingMode?: "Point" | "LineString" | "Polygon" | null;
  onDrawingFinish: (data: FeatureCollection<Geometry>) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({
  style,
  drawingMode,
  onDrawingFinish,
}) => {
  const { layers, baseMap } = useLayerDataContext();
  const {
    removeLayer,
    refreshLayerVisibilityWithState,
    saveLayerVisibilityState,
    setMapInstance,
  } = useLayerActionContext();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const addedLayerIds = useRef<string[]>([]);
  const [firstLoadComplete, setFirstLoadComplete] = useState(false);

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current) {
      const mapInstance = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: baseMap,
        center: [10.28, 63.4],
        zoom: 10,
      });

      mapRef.current = mapInstance;
      setMapInstance(mapInstance);

      // Initialize MapboxDraw
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          point: false,
          line_string: false,
          polygon: false,
          trash: false,
        },
      });
      drawRef.current = draw;
      mapInstance.addControl(draw, "top-right"); // Add drawing controls

      mapInstance.on("load", () => {
        setFirstLoadComplete(true);
        refreshLayerVisibilityWithState(); // Reapply saved visibility state
        updateMapLayers(layers); // Re-add layers to the map
      });

      // Handle drawing events
      mapInstance.on("draw.create", handleDrawEvent);
      mapInstance.on("draw.update", handleDrawEvent);
      mapInstance.on("draw.delete", handleDrawEvent);

      return () => {
        mapRef.current?.remove();
        mapRef.current = null;
      };
    }
  }, [baseMap]);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;

      // Re-apply layers when the style is reloaded
      const handleStyleData = () => {
        updateMapLayers(layers);
      };

      map.on("styledata", handleStyleData);

      return () => {
        map.off("styledata", handleStyleData);
      };
    }
  }, [baseMap]);

  const isStyleLoaded = () => {
    return mapRef.current !== null && mapRef.current.isStyleLoaded();
  };

  useEffect(() => {
    saveLayerVisibilityState(); // Save the current visibility state before changing base map
  }, [baseMap]);

  useEffect(() => {
    if (firstLoadComplete) {
      updateMapLayers(layers); // Only update layers if the map has completed initial load
    }
  }, [layers, firstLoadComplete]);

  const updateMapLayers = (layers: GeoJSONLayer[]) => {
    if (!isStyleLoaded() || !mapRef.current) return;
    const map = mapRef.current;

    removeUnusedLayers(layers);

    layers.forEach((layer) => {
      const { type, paint } = determineType(layer);

      if (!map.getSource(layer.id)) {
        map.addSource(layer.id, { type: "geojson", data: layer.data });
        map.addLayer({ id: layer.id, type, source: layer.id, paint });
        addedLayerIds.current.push(layer.id);
      } else {
        const geoJSONSource = map.getSource(layer.id) as mapboxgl.GeoJSONSource;
        geoJSONSource.setData(layer.data);
        updateLayerProperties(layer, type);
      }

      map.setLayoutProperty(layer.id, "visibility", determineVisibility(layer));
    });

    reorderLayersAfterLoad(layers);
  };

  const reorderLayersAfterLoad = (layers: GeoJSONLayer[], attempts = 0) => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const allLayersAdded = layers.every((layer) => map.getLayer(layer.id));

    if (allLayersAdded) {
      reorderLayers(layers);
    } else if (attempts < 10) {
      setTimeout(() => reorderLayersAfterLoad(layers, attempts + 1), 100);
    }
  };

  const reorderLayers = (layers: GeoJSONLayer[]) => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const reversedLayers = [...layers].reverse();

    reversedLayers.forEach((layer, index) => {
      const layerId = layer.id;
      const nextLayerId = reversedLayers[index + 1]?.id;

      if (map.getLayer(layerId)) {
        map.moveLayer(layerId, nextLayerId || undefined);
      }
    });
  };

  const updateLayerProperties = (layer: GeoJSONLayer, type: string) => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    switch (type) {
      case "fill":
        map.setPaintProperty(layer.id, "fill-color", layer.color);
        map.setPaintProperty(layer.id, "fill-opacity", layer.opacity);
        map.setPaintProperty(
          layer.id,
          "fill-outline-color",
          layer.isVoronoi ? "black" : layer.color
        );
        break;
      case "line":
        map.setPaintProperty(layer.id, "line-color", layer.color);
        map.setPaintProperty(layer.id, "line-opacity", layer.opacity);
        break;
      case "circle":
        map.setPaintProperty(layer.id, "circle-color", layer.color);
        map.setPaintProperty(layer.id, "circle-opacity", layer.opacity);
        break;
    }
  };

  const determineType = (
    layer: GeoJSONLayer
  ): { type: "fill" | "circle" | "line"; paint: mapboxgl.AnyPaint } => {
    const geometryType = layer.data.features[0]?.geometry.type;
    switch (geometryType) {
      case "Point":
      case "MultiPoint":
        return {
          type: "circle",
          paint: {
            "circle-radius": 5,
            "circle-color": layer.color,
            "circle-opacity": 1,
          },
        };
      case "LineString":
      case "MultiLineString":
        return {
          type: "line",
          paint: {
            "line-color": layer.color,
            "line-width": 2,
            "line-opacity": 1,
          },
        };
      case "Polygon":
      case "MultiPolygon":
        return {
          type: "fill",
          paint: {
            "fill-color": layer.color,
            "fill-opacity": 0.9,
            "fill-outline-color": layer.isVoronoi ? "black" : layer.color,
          },
        };
      default:
        throw new Error(`Unsupported geometry type: ${geometryType}`);
    }
  };

  const determineVisibility = (layer: GeoJSONLayer) => {
    return layer.visible ? "visible" : "none";
  };

  const removeUnusedLayers = (currentLayers: GeoJSONLayer[]) => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const currentLayerIds = currentLayers.map((layer) => layer.id);

    addedLayerIds.current.forEach((layerId) => {
      if (!currentLayerIds.includes(layerId)) {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
        if (map.getSource(layerId)) {
          map.removeSource(layerId);
        }
        removeLayer(layerId);
        addedLayerIds.current = addedLayerIds.current.filter(
          (id) => id !== layerId
        );
      }
    });
  };

  useEffect(() => {
    if (firstLoadComplete) {
      updateMapLayers(layers);
    }
  }, [layers, firstLoadComplete]);

  useEffect(() => {
    if (!mapRef.current || !drawRef.current) return;

    // Set drawing mode based on the `drawingMode` prop
    const draw = drawRef.current;

    switch (drawingMode) {
      case "Point":
        draw.changeMode("draw_point");
        break;
      case "LineString":
        draw.changeMode("draw_line_string");
        break;
      case "Polygon":
        draw.changeMode("draw_polygon");
        break;
      default:
        draw.changeMode("simple_select"); // Default to selection mode
        break;
    }
  }, [drawingMode]);

  const handleDrawEvent = () => {
    if (!drawRef.current) return;

    const draw = drawRef.current;
    const features = draw.getAll();

    if (features.features.length > 0) {
      onDrawingFinish(features); // Pass drawn features to parent component
    }
  };

  return <div ref={mapContainerRef} className="h-full w-full" style={style} />;
};

export default MapContainer;
