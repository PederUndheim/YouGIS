import React, {
  ReactNode,
  createContext,
  useState,
  useContext,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { GeoJSONLayer } from "../types";
import { v4 as uuidv4 } from "uuid";
import { getRandomColor } from "../utils/colorUtils";
import { bbox } from "@turf/turf";

// Define the context types
interface LayerDataContextType {
  layers: GeoJSONLayer[];
  baseMap: string;
}

interface LayerActionContextType {
  addLayer: (
    geojsonData: GeoJSON.FeatureCollection,
    color: string,
    name: string,
    prepend?: boolean,
    opacity?: number,
    isVoronoi?: boolean
  ) => void;
  setLayers: (layers: GeoJSONLayer[]) => void;
  removeLayer: (layerId: string) => void;
  setBaseMap: (baseMap: string) => void;
  toggleVisibility: (layerId: string) => void;
  toggleAllLayersVisibility: () => void;
  updateLayerStyle: (
    layerId: string,
    color: string,
    opacity: number,
    layerName?: string
  ) => void;
  clearLayers: () => void;
  refreshLayerVisibilityWithState: () => void;
  saveLayerVisibilityState: () => void;
  zoomToLayer: (layerId: string) => void;
  setMapInstance: (mapInstance: mapboxgl.Map) => void;
}

// Define the Selected Layer Context
interface SelectedLayerContextType {
  selectedLayerIds: string[];
  selectLayer: (
    layerId: string,
    multiSelect: boolean,
    rangeSelect: boolean
  ) => void;
  deselectLayer: (layerId: string) => void;
}

// Create two contexts: one for data and one for actions
const LayerDataContext = createContext<LayerDataContextType | undefined>(
  undefined
);
const LayerActionContext = createContext<LayerActionContextType | undefined>(
  undefined
);
const SelectedLayerContext = createContext<
  SelectedLayerContextType | undefined
>(undefined);

// Provider component
export const LayerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [layers, setLayers] = useState<GeoJSONLayer[]>([]);
  const [baseMap, setBaseMap] = useState<string>(
    "mapbox://styles/mapbox/light-v11"
  ); // Default basemap
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const setMapInstance = useCallback((mapInstance: mapboxgl.Map) => {
    mapRef.current = mapInstance;
  }, []);

  // Ref to store the previous visibility state of all layers
  const visibilityStateRef = useRef<{ id: string; visible: boolean }[]>([]);

  // Save the visibility state before map style change
  const saveLayerVisibilityState = useCallback(() => {
    visibilityStateRef.current = layers.map((layer) => ({
      id: layer.id,
      visible: layer.visible,
    }));
  }, [layers]);

  // Reapply the saved visibility state after map style change
  const refreshLayerVisibilityWithState = useCallback(() => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) => {
        const savedState = visibilityStateRef.current.find(
          (state) => state.id === layer.id
        );
        return savedState ? { ...layer, visible: savedState.visible } : layer;
      })
    );
  }, []);

  // Memoized layer data
  const layerData = useMemo(() => ({ layers, baseMap }), [layers, baseMap]);

  useEffect(() => {
    (window as any).layers = layers;
  }, [layers]);

  // Function to add a new layer
  const addLayer = useCallback(
    (
      geojsonData: GeoJSON.FeatureCollection,
      color: string,
      name: string,
      prepend?: boolean,
      opacity?: number,
      isVoronoi?: boolean
    ) => {
      // Determine the layer type based on the first feature
      const layerType =
        geojsonData.features.length > 0
          ? geojsonData.features[0].geometry.type
          : "Unknown";

      const newLayer: GeoJSONLayer = {
        id: uuidv4(),
        data: geojsonData,
        color: color || getRandomColor(),
        name,
        visible: true,
        opacity:
          opacity !== undefined
            ? opacity
            : layerType === "Polygon" || layerType === "MultiPolygon"
            ? 0.9
            : 1.0,
        type:
          layerType === "Point"
            ? "Point"
            : layerType === "LineString" || layerType === "MultiLineString"
            ? "LineString"
            : layerType === "Polygon" || layerType === "MultiPolygon"
            ? "Polygon"
            : "Unknown",
        isVoronoi: isVoronoi || false,
      };

      if (prepend) {
        setLayers((prevLayers) => [newLayer, ...prevLayers]);
      } else {
        setLayers((prevLayers) => [...prevLayers, newLayer]);
      }
    },
    []
  );

  // Function to remove a layer by ID
  const removeLayer = useCallback((layerId: string) => {
    setLayers((prevLayers) =>
      prevLayers.filter((layer) => layer.id !== layerId)
    );
  }, []);

  // Function to clear all layers
  const clearLayers = useCallback(() => {
    setLayers([]); // Clear all layers
  }, []);

  // Function to set base map style
  const setBaseMapStyle = useCallback((newBaseMap: string) => {
    setBaseMap(newBaseMap);
  }, []);

  const zoomToLayer = useCallback(
    (layerId: string) => {
      const map = mapRef.current;
      if (!map) {
        console.error("Map instance not found");
        return;
      }

      const layer = layers.find((l) => l.id === layerId);
      if (!layer || !layer.data.features || layer.data.features.length === 0) {
        console.warn(`Layer ${layerId} does not have valid features.`);
        return;
      }

      try {
        // Calculate the bounding box using Turf.js
        const [minLng, minLat, maxLng, maxLat] = bbox(layer.data);

        // Fit the map to the bounding box
        map.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          { padding: 20 }
        );
      } catch (error) {
        console.error("Error calculating bbox:", error);
      }
    },
    [layers]
  );

  // Function to toggle visibility of a specific layer
  const toggleVisibility = useCallback((layerId: string) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  }, []);

  // Function to toggle visibility of all layers
  const toggleAllLayersVisibility = useCallback(() => {
    setLayers((prevLayers) => {
      const allVisible = prevLayers.every((layer) => layer.visible);
      return prevLayers.map((layer) => ({ ...layer, visible: !allVisible }));
    });
  }, []);

  const updateLayerStyle = useCallback(
    (layerId: string, color: string, opacity: number, name?: string) => {
      setLayers((prevLayers) =>
        prevLayers.map((layer) =>
          layer.id === layerId
            ? { ...layer, color, opacity, name: name ?? layer.name }
            : layer
        )
      );
    },
    []
  );

  // Create state for selected layers
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);

  const selectLayer = useCallback(
    (layerId: string, multiSelect: boolean, rangeSelect: boolean) => {
      setSelectedLayerIds((prevSelected) => {
        const currentIndex = layers.findIndex((layer) => layer.id === layerId);
        const lastIndex =
          prevSelected.length > 0
            ? layers.findIndex(
                (layer) => layer.id === prevSelected[prevSelected.length - 1]
              )
            : -1;

        let updatedSelection = [];

        if (rangeSelect && prevSelected.length > 0) {
          // Range selection logic: Add all layers in the range
          const range = layers
            .slice(
              Math.min(currentIndex, lastIndex),
              Math.max(currentIndex, lastIndex) + 1
            )
            .map((layer) => layer.id);

          // Merge the range into the current selection
          updatedSelection = Array.from(new Set([...prevSelected, ...range]));
        } else if (multiSelect) {
          // Multi-select logic: Toggle the selected layer
          if (prevSelected.includes(layerId)) {
            // Remove the layer if it's already selected
            updatedSelection = prevSelected.filter((id) => id !== layerId);
          } else {
            // Add the layer to the selection
            updatedSelection = [...prevSelected, layerId];
          }
        } else {
          // Single select: Clear all selections except the clicked layer
          updatedSelection = [layerId];
        }
        return updatedSelection;
      });
    },
    [layers]
  );

  const deselectLayer = (layerId: string) => {
    setSelectedLayerIds((prev) => prev.filter((id) => id !== layerId));
  };

  // Memoized actions
  const layerActions = useMemo(
    () => ({
      addLayer,
      setLayers,
      removeLayer,
      setBaseMap: setBaseMapStyle,
      toggleVisibility,
      toggleAllLayersVisibility,
      updateLayerStyle,
      clearLayers,
      refreshLayerVisibilityWithState,
      saveLayerVisibilityState,
      zoomToLayer,
      setMapInstance,
    }),
    [
      addLayer,
      setLayers,
      removeLayer,
      setBaseMapStyle,
      toggleVisibility,
      toggleAllLayersVisibility,
      updateLayerStyle,
      clearLayers,
      refreshLayerVisibilityWithState,
      saveLayerVisibilityState,
      zoomToLayer,
      setMapInstance,
    ]
  );

  // Memoized selected layer context
  const selectedLayerContextValue = useMemo(
    () => ({ selectedLayerIds, selectLayer, deselectLayer }),
    [selectedLayerIds, selectLayer, deselectLayer]
  );

  return (
    <LayerDataContext.Provider value={layerData}>
      <LayerActionContext.Provider value={layerActions}>
        <SelectedLayerContext.Provider value={selectedLayerContextValue}>
          {children}
        </SelectedLayerContext.Provider>
      </LayerActionContext.Provider>
    </LayerDataContext.Provider>
  );
};

// Custom hooks to use the contexts
export const useLayerDataContext = () => {
  const context = useContext(LayerDataContext);
  if (!context) {
    throw new Error("useLayerDataContext must be used within a LayerProvider");
  }
  return context;
};

export const useLayerActionContext = () => {
  const context = useContext(LayerActionContext);
  if (!context) {
    throw new Error(
      "useLayerActionContext must be used within a LayerProvider"
    );
  }
  return context;
};

// Custom hook for selected layer context
export const useSelectedLayerContext = () => {
  const context = useContext(SelectedLayerContext);
  if (!context) {
    throw new Error(
      "useSelectedLayerContext must be used within a LayerProvider"
    );
  }
  return context;
};
