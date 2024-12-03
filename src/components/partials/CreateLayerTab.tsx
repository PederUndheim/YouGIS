import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import CustomTextField from "../ui/CustomTextField";
import CircleIcon from "@mui/icons-material/Circle";
import PolylineIcon from "@mui/icons-material/Polyline";
import PentagonIcon from "@mui/icons-material/Pentagon";

interface CreateLayerTabProps {
  onLayerCreate: (
    layerName: string,
    geometryType: "Point" | "LineString" | "Polygon"
  ) => void;
  layerName: string;
  setLayerName: React.Dispatch<React.SetStateAction<string>>;
  geometryType: "Point" | "LineString" | "Polygon" | null;
  setGeometryType: React.Dispatch<
    React.SetStateAction<"Point" | "LineString" | "Polygon" | null>
  >;
}

const CreateLayerTab: React.FC<CreateLayerTabProps> = ({
  onLayerCreate,
  layerName,
  setLayerName,
  geometryType,
  setGeometryType,
}) => {
  const [isNameModified, setIsNameModified] = useState(false);
  const [error, setError] = useState<string>("");

  // Automatically set the layer name when geometryType changes, if name is not modified
  useEffect(() => {
    if (!isNameModified && geometryType) {
      setLayerName(`drawn_${geometryType.toLowerCase()}`);
    }
  }, [geometryType, isNameModified, setLayerName]);

  const handleCreateLayer = () => {
    if (!layerName.trim()) {
      setError("Layer name is required.");
      return;
    }

    if (!geometryType) {
      setError("Geometry type is required.");
      return;
    }

    setError(""); // Clear error
    onLayerCreate(layerName, geometryType);
  };

  console.log(handleCreateLayer);

  return (
    <Box>
      <Typography sx={{ color: "#A8D99C", fontSize: "0.8rem", mb: 1 }}>
        Select Geometry Type
      </Typography>
      <ToggleButtonGroup
        id="geometry-type"
        exclusive
        value={geometryType}
        onChange={(_, value) => value && setGeometryType(value)}
        sx={{
          mt: 1,
          mb: 3,
          display: "flex",
          "& .MuiToggleButton-root": {
            bgcolor: "#555555",
            color: "#ffffff",
            borderColor: "#A8D99C",
            "&.Mui-selected": {
              bgcolor: "#A8D99C",
              color: "#000",
            },
            "&.Mui-selected:hover": {
              bgcolor: "#89C287",
            },
            "&:hover": {
              bgcolor: "#666666",
            },
          },
        }}
      >
        <ToggleButton value="Point">
          <CircleIcon sx={{ mr: 1, width: "0.7rem" }} />
          Point
        </ToggleButton>
        <ToggleButton value="LineString">
          <PolylineIcon sx={{ mr: 1, width: "1.2rem" }} />
          Line
        </ToggleButton>
        <ToggleButton value="Polygon">
          <PentagonIcon sx={{ mr: 1, width: "1.2rem" }} />
          Polygon
        </ToggleButton>
      </ToggleButtonGroup>

      <Box sx={{ mb: 1 }}>
        <Typography mx={{ fontSize: "0.7rem", color: "#ECAC7A", mb: 2 }}>
          Must provide layer name to start drawing
        </Typography>
      </Box>

      <CustomTextField
        id="layer-name"
        label="Layer Name"
        value={layerName}
        onChange={(e) => {
          setLayerName(e.target.value);
          setIsNameModified(true);
        }}
        error={!!error}
        helperText={error}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Box>
  );
};

export default CreateLayerTab;
