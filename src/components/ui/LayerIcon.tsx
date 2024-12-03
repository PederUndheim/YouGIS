import React from "react";
import { SvgIcon } from "@mui/material";
import { Timeline, FiberManualRecord } from "@mui/icons-material";
import { useLayerDataContext } from "../../context/LayerContext";
import { useTempLayerContext } from "../../context/TempLayerContext";

// PolygonIcon component as a reusable SVG Icon
const PolygonIcon: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => (
  <SvgIcon {...props}>
    <rect width="24" height="24" rx="3" ry="3" />
  </SvgIcon>
);

// LayerIcon functional component
interface LayerIconProps {
  layerId: string;
  size?: number;
  isTempLayers?: boolean;
}

const LayerIcon: React.FC<LayerIconProps> = ({
  layerId,
  size = 24,
  isTempLayers = false,
}) => {
  const { layers } = useLayerDataContext();
  const { tempLayers } = useTempLayerContext();

  // Determine which layers to use based on the isTempLayers prop
  const currentLayers = isTempLayers ? tempLayers : layers;

  // Find the specific layer by ID
  const layer = currentLayers.find((l) => l.id === layerId);

  if (!layer) {
    console.warn("Layer not found for ID:", layerId);
    return null;
  }

  // Function to get the color from the layer's data
  const getColor = (): string => {
    return layer.color || "#000";
  };

  // Icon container styles to ensure consistent layout
  const iconContainerStyles: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: "transparent",
    marginRight: "8px",
  };

  // Dynamic icon rendering with different font sizes for each layer type
  const renderIcon = () => {
    let iconFontSize = size - 4;
    switch (layer.type) {
      case "Polygon":
      case "MultiPolygon":
        iconFontSize = size - 8;
        return (
          <PolygonIcon
            style={{
              fontSize: `${iconFontSize}px`,
              color: getColor(),
              backgroundColor: "transparent",
              borderRadius: "1px",
              border: "none",
            }}
          />
        );
      case "LineString":
      case "MultiLineString":
        iconFontSize = size;
        return (
          <Timeline
            style={{
              fontSize: `${iconFontSize}px`,
              color: getColor(),
              backgroundColor: "transparent",
            }}
          />
        );
      case "Point":
        iconFontSize = size - 8;
        return (
          <FiberManualRecord
            style={{
              fontSize: `${iconFontSize}px`,
              color: getColor(),
              backgroundColor: "transparent",
            }}
          />
        );
      default:
        console.warn("Unidentified layer type:", layer.type);
        return null;
    }
  };

  return <div style={iconContainerStyles}>{renderIcon()}</div>;
};

export default LayerIcon;
