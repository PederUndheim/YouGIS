import React, { useState } from "react";
import {
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  SelectChangeEvent,
} from "@mui/material";
import { useSnackbar } from "notistack";
import {
  useLayerDataContext,
  useLayerActionContext,
} from "../../context/LayerContext";
import ModalContainer from "../containers/ModalContainer";
import CustomTextField from "../ui/CustomTextField";
import { FeatureCollection, BBox, Geometry } from "geojson";
import { bbox, bboxPolygon } from "@turf/turf";
import { getRandomColor } from "../../utils/colorUtils";

const BoundingBoxTool: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const { layers } = useLayerDataContext();
  const { addLayer } = useLayerActionContext();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);
  const [outputLayerName, setOutputLayerName] = useState<string>("");
  const [outputLayerNameError, setOutputLayerNameError] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const [isOutputNameModified, setIsOutputNameModified] =
    useState<boolean>(false);

  // Accept all geometry types
  const selectableLayers = layers.filter(
    (layer) =>
      layer.type === "Polygon" ||
      layer.type === "LineString" ||
      layer.type === "Point" ||
      layer.type === "MultiPolygon" ||
      layer.type === "MultiLineString"
  );

  const validateInputs = () => {
    const isOutputLayerNameValid = outputLayerName !== "";
    const isLayerSelectionValid = selectedLayerIds.length > 0;

    setOutputLayerNameError(!isOutputLayerNameValid);
    setShowError(!isLayerSelectionValid);

    return isOutputLayerNameValid && isLayerSelectionValid;
  };

  const executeBoundingBox = (): boolean => {
    if (!validateInputs()) {
      return false;
    }

    try {
      // Gather all features from selected layers
      const selectedFeatures: FeatureCollection<Geometry> = {
        type: "FeatureCollection",
        features: selectedLayerIds.flatMap((layerId) => {
          const layer = layers.find((layer) => layer.id === layerId);
          return layer?.data.features || [];
        }),
      };

      // Calculate the bounding box
      const bboxResult: BBox = bbox(selectedFeatures);
      const bboxFeature = bboxPolygon(bboxResult);

      // Create a new GeoJSON feature collection for the bounding box
      const newLayer: FeatureCollection<Geometry> = {
        type: "FeatureCollection",
        features: [bboxFeature],
      };

      addLayer(newLayer, getRandomColor(), outputLayerName, true);
      enqueueSnackbar("Bounding box created successfully!", {
        variant: "success",
        autoHideDuration: 2500,
      });
      setErrorMessage("");
      return true;
    } catch (error) {
      console.error("Error creating bounding box:", error);
      setErrorMessage("An error occurred while creating the bounding box.");
      return false;
    }
  };

  const handleSubmit = () => {
    if (executeBoundingBox()) {
      onClose();
    }
  };

  const handleOutputLayerNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOutputLayerName(e.target.value);
    setIsOutputNameModified(true);
    setOutputLayerNameError(false);
  };

  const handleLayerSelectionChange = (event: SelectChangeEvent<string[]>) => {
    const selectedIds = event.target.value as string[];
    setSelectedLayerIds(selectedIds);
    setShowError(false);

    // Dynamically set the output layer name if it hasn't been modified
    if (selectedIds.length > 0 && !isOutputNameModified) {
      const selectedLayerNames = selectableLayers
        .filter((layer) => selectedIds.includes(layer.id))
        .map((layer) => layer.name)
        .join("_");
      setOutputLayerName(`BoundingBox_${selectedLayerNames}`);
    }
  };

  return (
    <ModalContainer
      open={open}
      onClose={onClose}
      header="Bounding Box Tool"
      submitLabel="Create Bounding Box"
      onSubmit={handleSubmit}
      headermargin={0.5}
    >
      <Box sx={{ mb: 3 }}>
        <Typography mx={{ fontSize: "0.7rem", color: "#ECAC7A", mb: 2 }}>
          Select one or more layers to create a bounding box
        </Typography>
        {errorMessage && (
          <Typography sx={{ color: "red", fontSize: "0.8rem" }}>
            {errorMessage}
          </Typography>
        )}
      </Box>

      <FormControl
        fullWidth
        variant="standard"
        sx={{ mb: 3 }}
        error={showError}
      >
        <InputLabel
          shrink
          sx={{
            color: "#A8D99C",
            "&.Mui-focused": {
              color: "#A8D99C",
            },
          }}
        >
          Select Layers
        </InputLabel>
        <Select
          multiple
          value={selectedLayerIds}
          onChange={handleLayerSelectionChange}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {(selected as string[]).map((layerId) => {
                const layer = selectableLayers.find(
                  (layer) => layer.id === layerId
                );
                return (
                  <Chip
                    key={layerId}
                    label={layer?.name || layerId}
                    sx={{
                      bgcolor: "#A8D99C",
                      color: "black",
                      "& .MuiChip-label": {
                        color: "black",
                      },
                      "&:hover": {
                        bgcolor: "#86C87A",
                      },
                    }}
                  />
                );
              })}
            </Box>
          )}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: "#555555",
                color: "#ffffff",
                "& .MuiMenuItem-root": {
                  // Style for menu items
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                  "&.Mui-selected": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                  "&.Mui-selected:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                },
              },
            },
          }}
          sx={{
            bgcolor: "#555555",
            color: "#ffffff",
            "&:before": {
              borderBottomColor: "#ffffff",
            },
            "&:hover:not(.Mui-disabled):before": {
              borderBottomColor: "#A8D99C",
            },
            "&:after": {
              borderBottomColor: "#A8D99C",
            },
            "& .MuiSelect-icon": {
              color: "#A8D99C",
            },
          }}
        >
          {selectableLayers.map((layer) => (
            <MenuItem key={layer.id} value={layer.id} sx={{ color: "#ffffff" }}>
              {layer.name}
            </MenuItem>
          ))}
        </Select>
        {showError && (
          <div style={{ color: "#d32f2f", marginTop: "4px", fontSize: "12px" }}>
            Please select at least one layer.
          </div>
        )}
      </FormControl>

      <CustomTextField
        label="Output Layer Name"
        value={outputLayerName}
        onChange={handleOutputLayerNameChange}
        error={outputLayerNameError}
        helperText={
          outputLayerNameError ? "Please enter an output layer name." : ""
        }
        InputLabelProps={{
          shrink: true,
        }}
      />
    </ModalContainer>
  );
};

export default BoundingBoxTool;
