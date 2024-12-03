import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { TempLayer } from "../types";
import { v4 as uuidv4 } from "uuid";
import { getRandomColor } from "../utils/colorUtils";

// Define context types
interface TempLayerContextType {
  tempLayers: TempLayer[];
  addTempLayer: (
    geojsonData: GeoJSON.FeatureCollection,
    name: string,
    color?: string
  ) => void;
  removeLayer: (layerId: string) => void;
  updateTempLayerName: (layerId: string, newName: string) => void;
  updateTempLayerColor: (layerId: string, newColor: string) => void;
  clearTempLayers: () => void;
}

// Create context
const TempLayerContext = createContext<TempLayerContextType | undefined>(
  undefined
);

// Provider component
export const TempLayerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tempLayers, setTempLayers] = useState<TempLayer[]>([]);

  const addTempLayer = useCallback(
    (geojsonData: GeoJSON.FeatureCollection, name: string, color?: string) => {
      // Determine the layer type based on the first feature
      const layerType =
        geojsonData.features.length > 0
          ? geojsonData.features[0].geometry.type
          : "Unknown";

      // Create the new TempLayer including the type
      const newLayer: TempLayer = {
        id: uuidv4(),
        name,
        color: color || getRandomColor(),
        data: geojsonData,
        opacity: 1,
        type:
          layerType === "Point"
            ? "Point"
            : layerType === "LineString" || layerType === "MultiLineString"
            ? "LineString"
            : layerType === "Polygon" || layerType === "MultiPolygon"
            ? "Polygon"
            : "Unknown",
      };

      // Add the new layer to the state
      setTempLayers((prevLayers) => [...prevLayers, newLayer]);
    },
    []
  );

  const removeLayer = useCallback((layerId: string) => {
    setTempLayers((prevLayers) =>
      prevLayers.filter((layer) => layer.id !== layerId)
    );
  }, []);

  const updateTempLayerName = useCallback(
    (layerId: string, newName: string) => {
      setTempLayers((prevLayers) =>
        prevLayers.map((layer) =>
          layer.id === layerId ? { ...layer, name: newName } : layer
        )
      );
    },
    []
  );

  const updateTempLayerColor = useCallback(
    (layerId: string, newColor: string) => {
      setTempLayers((prevLayers) =>
        prevLayers.map((layer) =>
          layer.id === layerId ? { ...layer, color: newColor } : layer
        )
      );
    },
    []
  );

  const clearTempLayers = useCallback(() => {
    setTempLayers([]);
  }, []);

  // Memoized context value
  const contextValue = useMemo(
    () => ({
      tempLayers,
      addTempLayer,
      removeLayer,
      updateTempLayerName,
      updateTempLayerColor,
      clearTempLayers,
    }),
    [
      tempLayers,
      addTempLayer,
      removeLayer,
      updateTempLayerName,
      updateTempLayerColor,
      clearTempLayers,
    ]
  );

  return (
    <TempLayerContext.Provider value={contextValue}>
      {children}
    </TempLayerContext.Provider>
  );
};

// Custom hook to use the TempLayerContext
export const useTempLayerContext = () => {
  const context = useContext(TempLayerContext);
  if (!context) {
    throw new Error(
      "useTempLayerContext must be used within a TempLayerProvider"
    );
  }
  return context;
};
