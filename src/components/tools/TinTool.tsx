import React, { useState } from "react";
import {
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import { useSnackbar } from "notistack";
import {
  useLayerDataContext,
  useLayerActionContext,
} from "../../context/LayerContext";
import ModalContainer from "../containers/ModalContainer";
import CustomTextField from "../ui/CustomTextField";
import { FeatureCollection, Point, Feature } from "geojson";
import { tin } from "@turf/turf";
import { getRandomColor } from "../../utils/colorUtils";

const TinTool: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const { layers } = useLayerDataContext();
  const { addLayer } = useLayerActionContext();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedLayerId, setSelectedLayerId] = useState<string>("");
  const [outputLayerName, setOutputLayerName] = useState<string>("");
  const [outputLayerNameError, setOutputLayerNameError] =
    useState<boolean>(false);
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState<boolean>(false);
  const [userModifiedOutputName, setUserModifiedOutputName] =
    useState<boolean>(false);
  const pointLayers = layers.filter((layer) => layer.type === "Point");

  const validateInputs = (): boolean => {
    const isLayerSelected = selectedLayerId !== "";
    const isOutputLayerNameValid = outputLayerName !== "";

    // Set field-specific errors
    setOutputLayerNameError(!isOutputLayerNameValid);

    return isLayerSelected && isOutputLayerNameValid;
  };

  const executeTin = (): boolean => {
    if (!validateInputs()) {
      return false;
    }

    try {
      // Find the selected layer
      const selectedLayer = pointLayers.find(
        (layer) => layer.id === selectedLayerId
      );

      if (!selectedLayer) {
        enqueueSnackbar("Selected layer not found.", {
          variant: "error",
          autoHideDuration: 2500,
        });
        return false;
      }

      // Filter valid point features
      const validFeatures = (selectedLayer.data.features ?? []).filter(
        (feature): feature is Feature<Point> => {
          return (
            feature?.geometry !== null &&
            feature?.geometry?.type === "Point" &&
            feature.geometry.coordinates.length === 2 &&
            feature.geometry.coordinates.every(
              (coord) => typeof coord === "number"
            )
          );
        }
      );

      if (validFeatures.length === 0) {
        enqueueSnackbar("The selected layer has no valid point features.", {
          variant: "error",
          autoHideDuration: 2500,
        });
        return false;
      }

      // Deduplicate points to avoid overlapping issues
      const uniqueFeatures = Array.from(
        new Map(
          validFeatures.map((feature) => [
            feature.geometry.coordinates.toString(),
            feature,
          ])
        ).values()
      );

      if (uniqueFeatures.length < 3) {
        enqueueSnackbar(
          "Insufficient unique points to create a TIN. At least 3 unique points are required.",
          { variant: "error", autoHideDuration: 2500 }
        );
        return false;
      }

      // Optionally filter out very closely spaced points
      const filteredFeatures = uniqueFeatures.filter(
        (feature, index, array) => {
          return !array.some((otherFeature, otherIndex) => {
            if (index === otherIndex) return false;
            const [x1, y1] = feature.geometry.coordinates;
            const [x2, y2] = otherFeature.geometry.coordinates;
            const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
            return distance < 0.00001; // Threshold for "too close" points
          });
        }
      );

      if (filteredFeatures.length < 3) {
        enqueueSnackbar(
          "Insufficient valid points after filtering. Ensure points are not too close together.",
          { variant: "error", autoHideDuration: 2500 }
        );
        return false;
      }

      const points: FeatureCollection<Point> = {
        type: "FeatureCollection",
        features: filteredFeatures,
      };

      // Generate TIN (2D Only, no z-property passed)
      const tinPolygons = tin(points);

      if (!tinPolygons || tinPolygons.features.length === 0) {
        enqueueSnackbar("No TIN polygons were generated.", {
          variant: "error",
          autoHideDuration: 2500,
        });
        return false;
      }

      // Add the new layer
      addLayer(tinPolygons, getRandomColor(), outputLayerName, true, 0.5, true);

      enqueueSnackbar("TIN polygons created successfully!", {
        variant: "success",
        autoHideDuration: 2500,
      });

      return true;
    } catch (error) {
      console.error("Error creating TIN polygons:", error);
      enqueueSnackbar("An error occurred while creating TIN polygons.", {
        variant: "error",
        autoHideDuration: 2500,
      });
      return false;
    }
  };

  const handleSubmit = () => {
    setHasTriedToSubmit(true);
    if (validateInputs() && executeTin()) {
      onClose();
    }
  };

  const handleInputLayerChange = (event: SelectChangeEvent<string>) => {
    const newLayerId = event.target.value;
    setSelectedLayerId(newLayerId);

    // Automatically update output layer name if not user-modified
    if (!userModifiedOutputName) {
      const layer = pointLayers.find((layer) => layer.id === newLayerId);
      if (layer) {
        setOutputLayerName(`${layer.name}_TIN`);
      }
    }
  };

  const handleOutputLayerNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOutputLayerName(e.target.value);
    setUserModifiedOutputName(true);
  };

  return (
    <ModalContainer
      open={open}
      onClose={onClose}
      header="TIN Tool"
      submitLabel="Generate TIN"
      onSubmit={handleSubmit}
      headermargin={0.5}
    >
      <Box sx={{ mb: 3 }}>
        <Typography mx={{ fontSize: "0.7rem", color: "#ECAC7A", mb: 2 }}>
          Select a point layer to generate a Triangular Irregular Network
        </Typography>
      </Box>

      {/* Point Layer Selection */}
      <FormControl
        fullWidth
        variant="standard"
        sx={{ mb: 3 }}
        error={!selectedLayerId && hasTriedToSubmit}
      >
        <InputLabel
          shrink
          sx={{
            color: "#A8D99C",
            "&.Mui-focused": { color: "#A8D99C" },
          }}
        >
          Select Point Layer
        </InputLabel>
        <Select
          value={selectedLayerId}
          onChange={handleInputLayerChange}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: "#555555",
                color: "#ffffff",
                "& .MuiMenuItem-root": {
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
          {pointLayers.map((layer) => (
            <MenuItem key={layer.id} value={layer.id} sx={{ color: "#ffffff" }}>
              {layer.name}
            </MenuItem>
          ))}
        </Select>
        {!selectedLayerId && hasTriedToSubmit && (
          <Typography
            sx={{
              color: "#d32f2f",
              fontSize: "0.8rem",
              marginTop: "4px",
            }}
          >
            Please select a layer containing points.
          </Typography>
        )}
      </FormControl>

      {/* Output Layer Name */}
      <CustomTextField
        label="Output Layer Name"
        value={outputLayerName}
        onChange={handleOutputLayerNameChange}
        error={outputLayerNameError}
        helperText={
          outputLayerNameError ? "Please enter an output layer name." : ""
        }
        InputLabelProps={{ shrink: true }}
      />
    </ModalContainer>
  );
};

export default TinTool;
