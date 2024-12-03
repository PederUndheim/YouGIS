import React, { useState } from "react";
import {
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useSnackbar } from "notistack";
import {
  useLayerDataContext,
  useLayerActionContext,
} from "../../context/LayerContext";
import ModalContainer from "../containers/ModalContainer";
import CustomTextField from "../ui/CustomTextField";
import { FeatureCollection, Point, Polygon, BBox, Feature } from "geojson";
import { voronoi, bbox } from "@turf/turf";
import { getRandomColor } from "../../utils/colorUtils";

const VoronoiTool: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const { layers } = useLayerDataContext();
  const { addLayer } = useLayerActionContext();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedLayerId, setSelectedLayerId] = useState<string>("");
  const [outputLayerName, setOutputLayerName] = useState<string>("");
  const [customBoundingBoxEnabled, setCustomBoundingBoxEnabled] =
    useState<boolean>(false);
  const [selectedBoundingBoxLayerId, setSelectedBoundingBoxLayerId] =
    useState<string>("");
  const [outputLayerNameError, setOutputLayerNameError] =
    useState<boolean>(false);
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState<boolean>(false);
  const [userModifiedOutputName, setUserModifiedOutputName] =
    useState<boolean>(false);
  const pointLayers = layers.filter((layer) => layer.type === "Point");
  const polygonLayers = layers.filter(
    (layer) => layer.type === "Polygon" || layer.type === "MultiPolygon"
  );

  const validateInputs = (): boolean => {
    const isLayerSelected = selectedLayerId !== "";
    const isOutputLayerNameValid = outputLayerName !== "";
    const isBoundingBoxSelected =
      !customBoundingBoxEnabled || selectedBoundingBoxLayerId !== "";

    // Set field-specific errors
    setOutputLayerNameError(!isOutputLayerNameValid);

    return isLayerSelected && isOutputLayerNameValid && isBoundingBoxSelected;
  };

  const executeVoronoi = (): boolean => {
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

      // Filter valid features
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

      // Construct FeatureCollection<Point>
      const points: FeatureCollection<Point> = {
        type: "FeatureCollection",
        features: validFeatures,
      };

      // Determine the bounding box
      const options: { bbox?: BBox } = {};
      if (customBoundingBoxEnabled) {
        const boundingBoxLayer = polygonLayers.find(
          (layer) => layer.id === selectedBoundingBoxLayerId
        );

        if (!boundingBoxLayer || boundingBoxLayer.data.features.length === 0) {
          enqueueSnackbar(
            "The selected bounding box layer has no valid features.",
            { variant: "error", autoHideDuration: 2500 }
          );
          return false;
        }

        options.bbox = bbox(
          boundingBoxLayer.data as FeatureCollection<Polygon>
        );
      } else {
        options.bbox = bbox(points);
      }

      // Generate Voronoi polygons
      const voronoiPolygons = voronoi(points, options);

      if (!voronoiPolygons || !voronoiPolygons.features) {
        enqueueSnackbar("No Voronoi polygons were generated.", {
          variant: "error",
          autoHideDuration: 2500,
        });
        return false;
      }

      // Filter out null or undefined features in the result
      voronoiPolygons.features = voronoiPolygons.features.filter(
        (f) => f != null
      );

      if (voronoiPolygons.features.length === 0) {
        enqueueSnackbar("No valid Voronoi polygons were generated.", {
          variant: "error",
          autoHideDuration: 2500,
        });
        return false;
      }

      // Enhance polygon properties for visualization
      voronoiPolygons.features = voronoiPolygons.features.map((feature) => {
        const randomColor = getRandomColor();
        return {
          ...feature,
          properties: {
            ...feature.properties,
            stroke: "#000000",
            "stroke-width": 10,
            "stroke-opacity": 20,
            fill: randomColor,
            "fill-opacity": 0.3,
          },
        };
      });

      // Add the new layer
      addLayer(
        voronoiPolygons,
        getRandomColor(),
        outputLayerName,
        true,
        0.5,
        true
      );

      // Show success notification
      enqueueSnackbar("Voronoi polygons created successfully!", {
        variant: "success",
        autoHideDuration: 2500,
      });

      return true;
    } catch (error) {
      console.error("Error creating Voronoi polygons:", error);
      enqueueSnackbar("An error occurred while creating Voronoi polygons.", {
        variant: "error",
        autoHideDuration: 2500,
      });
      return false;
    }
  };

  const handleSubmit = () => {
    setHasTriedToSubmit(true);
    if (validateInputs() && executeVoronoi()) {
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
        setOutputLayerName(`${layer.name}_Voronoi`);
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
      header="Voronoi Tool"
      submitLabel="Generate Voronoi"
      onSubmit={handleSubmit}
      headermargin={0.5}
    >
      <Box sx={{ mb: 3 }}>
        <Typography mx={{ fontSize: "0.7rem", color: "#ECAC7A", mb: 2 }}>
          Select a point layer to generate Voronoi polygons
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

      {/* Bounding Box Toggle */}
      <FormControlLabel
        control={
          <Switch
            checked={customBoundingBoxEnabled}
            onChange={(e) => setCustomBoundingBoxEnabled(e.target.checked)}
            sx={{
              "&:active": {
                "& .MuiSwitch-track": {
                  bgcolor: "#81c784",
                },
              },

              "& .MuiSwitch-switchBase": {
                "&.Mui-checked": {
                  color: "#fff",
                  "& + .MuiSwitch-track": {
                    bgcolor: "#A8D99C",
                  },
                },
              },

              "& .MuiSwitch-thumb": {
                bgcolor: "#A8D99C",
              },

              "& .MuiSwitch-track": {
                bgcolor: "#e0e0e0",
              },
            }}
          />
        }
        label="Use Custom Bounding Box"
        sx={{ mb: 3 }}
      />

      {/* Bounding Box Layer Selection */}
      {customBoundingBoxEnabled && (
        <FormControl
          fullWidth
          variant="standard"
          sx={{ mb: 3 }}
          error={
            hasTriedToSubmit &&
            customBoundingBoxEnabled &&
            !selectedBoundingBoxLayerId
          }
        >
          <InputLabel
            shrink
            sx={{
              color: "#A8D99C",
              "&.Mui-focused": { color: "#A8D99C" },
            }}
          >
            Select Bounding Box Layer
          </InputLabel>
          <Select
            value={selectedBoundingBoxLayerId}
            onChange={(event: SelectChangeEvent<string>) =>
              setSelectedBoundingBoxLayerId(event.target.value)
            }
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
            {polygonLayers.map((layer) => (
              <MenuItem
                key={layer.id}
                value={layer.id}
                sx={{ color: "#ffffff" }}
              >
                {layer.name}
              </MenuItem>
            ))}
          </Select>
          {hasTriedToSubmit &&
            customBoundingBoxEnabled &&
            !selectedBoundingBoxLayerId && (
              <Typography
                sx={{
                  color: "#d32f2f",
                  fontSize: "0.8rem",
                  marginTop: "4px",
                }}
              >
                Please select a bounding box polygon layer.
              </Typography>
            )}
        </FormControl>
      )}

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

export default VoronoiTool;
