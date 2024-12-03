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
import CustomSelectField from "../ui/CustomSelectField";
import {
  FeatureCollection,
  Polygon,
  MultiPolygon,
  Feature,
  Point,
  MultiPoint,
  LineString,
  Position,
} from "geojson";
import intersect from "@turf/intersect";
import pointsWithinPolygon from "@turf/points-within-polygon";
import lineSplit from "@turf/line-split";
import booleanWithin from "@turf/boolean-within";
import { getRandomColor } from "../../utils/colorUtils";
import { booleanIntersects, lineIntersect, lineString } from "@turf/turf";
import { Step } from "react-joyride";
import TutorialDetails from "../tutorial/DetailedTutorial";

const ClipTool: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const { layers } = useLayerDataContext();
  const { addLayer } = useLayerActionContext();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedLayerId, setSelectedLayerId] = useState<string>("");
  const [clipLayerId, setClipLayerId] = useState<string>("");
  const [outputLayerName, setOutputLayerName] = useState<string>("");
  const [layerSelectionError, setLayerSelectionError] =
    useState<boolean>(false);
  const [clipLayerSelectionError, setClipLayerSelectionError] =
    useState<boolean>(false);
  const [outputLayerNameError, setOutputLayerNameError] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isOutputNameModified, setIsOutputNameModified] =
    useState<boolean>(false);
  const [isJoyrideOpen, setIsJoyrideOpen] = useState(false);

  const allLayers = layers.filter(
    (layer) =>
      layer.type === "Polygon" ||
      layer.type === "MultiPolygon" ||
      layer.type === "Point" ||
      layer.type === "LineString" ||
      layer.type === "MultiLineString"
  );

  const polygonLayers = layers.filter(
    (layer) => layer.type === "Polygon" || layer.type === "MultiPolygon"
  );

  const validateInputs = () => {
    const isLayerSelected = selectedLayerId.length > 0;
    const isClipLayerSelected = clipLayerId !== "";
    const isOutputLayerNameValid = outputLayerName !== "";

    setLayerSelectionError(!isLayerSelected);
    setClipLayerSelectionError(!isClipLayerSelected);
    setOutputLayerNameError(!isOutputLayerNameValid);

    return isLayerSelected && isClipLayerSelected && isOutputLayerNameValid;
  };

  // Utility function to compare two coordinates (arrays) for equality
  function arraysEqual(coord1: Position, coord2: Position): boolean {
    return coord1[0] === coord2[0] && coord1[1] === coord2[1];
  }

  const executeClip = (): boolean => {
    if (!validateInputs()) {
      return false;
    }

    // Find the selected layer and clip layer
    try {
      const clipLayer = polygonLayers.find((layer) => layer.id === clipLayerId);

      if (!clipLayer || clipLayer.data.features.length === 0) {
        setErrorMessage("The selected polygon layer has no features.");
        return false;
      }

      const clipFeatures = clipLayer.data.features.filter(
        (feature) =>
          feature.geometry?.type === "Polygon" ||
          feature.geometry?.type === "MultiPolygon"
      ) as Feature<Polygon | MultiPolygon>[];

      const resultFeatures: any[] = [];

      const inputLayer = layers.find((layer) => layer.id === selectedLayerId);

      if (!inputLayer) {
        setErrorMessage("Selected layer not found.");
        return false;
      }

      const inputFeatures = inputLayer.data.features;

      inputFeatures.forEach((inputFeature) => {
        clipFeatures.forEach((clipFeature) => {
          // Handle Point geometries
          if (
            inputFeature.geometry?.type === "Point" ||
            inputFeature.geometry?.type === "MultiPoint"
          ) {
            const pointsResult = pointsWithinPolygon(
              {
                type: "FeatureCollection",
                features: [inputFeature] as Feature<Point | MultiPoint>[], // Explicitly cast as required
              },
              clipFeature
            );
            if (pointsResult.features.length > 0) {
              resultFeatures.push(...pointsResult.features);
            }
          }

          // Handle LineString geometries
          else if (inputFeature.geometry?.type === "LineString") {
            // Step 1: Create a valid LineString feature from the input
            const inputLine: Feature<LineString> = lineString(
              inputFeature.geometry.coordinates as Position[],
              inputFeature.properties || {}
            );

            // Step 2: Check if the entire line is within the polygon
            if (booleanWithin(inputLine, clipFeature as Feature<Polygon>)) {
              // If fully inside, add the entire line directly
              resultFeatures.push(inputLine);
            } else if (
              booleanIntersects(inputLine, clipFeature as Feature<Polygon>)
            ) {
              // Step 3: Split the line into segments at the polygon boundary
              const splitLine = lineSplit(
                inputLine,
                clipFeature as Feature<Polygon>
              );

              if (splitLine && splitLine.features.length > 0) {
                // Step 4: Process each split segment
                splitLine.features.forEach((segment) => {
                  if (booleanWithin(segment, clipFeature as Feature<Polygon>)) {
                    // If the segment is fully inside, add it directly
                    resultFeatures.push(segment);
                  } else if (
                    booleanIntersects(segment, clipFeature as Feature<Polygon>)
                  ) {
                    // Step 5: Handle partially intersecting segments
                    const segmentCoords = segment.geometry
                      .coordinates as Position[];
                    const insideCoords: Position[] = []; // To collect valid coordinates within the polygon

                    for (let i = 0; i < segmentCoords.length - 1; i++) {
                      const start: Position = segmentCoords[i];
                      const end: Position = segmentCoords[i + 1];
                      const lineSegment: Feature<LineString> = lineString([
                        start,
                        end,
                      ]);

                      // Case 1: Fully within the polygon
                      if (
                        booleanWithin(
                          lineSegment,
                          clipFeature as Feature<Polygon>
                        )
                      ) {
                        if (
                          !insideCoords.some((coord) =>
                            arraysEqual(coord, start)
                          )
                        ) {
                          insideCoords.push(start);
                        }
                        if (
                          !insideCoords.some((coord) => arraysEqual(coord, end))
                        ) {
                          insideCoords.push(end);
                        }
                      }

                      // Case 2: Partially intersecting the polygon
                      else if (
                        booleanIntersects(
                          lineSegment,
                          clipFeature as Feature<Polygon>
                        )
                      ) {
                        // Find intersection points
                        const intersections = lineIntersect(
                          lineSegment,
                          clipFeature as Feature<Polygon>
                        );

                        // Add intersection points and in-polygon coordinates
                        intersections.features.forEach((point) => {
                          const coord = point.geometry.coordinates as Position;
                          if (
                            !insideCoords.some((existing) =>
                              arraysEqual(existing, coord)
                            )
                          ) {
                            insideCoords.push(coord);
                          }
                        });

                        // Add start and end points if they are inside the polygon
                        if (
                          booleanWithin(
                            lineString([start, start]),
                            clipFeature as Feature<Polygon>
                          ) &&
                          !insideCoords.some((coord) =>
                            arraysEqual(coord, start)
                          )
                        ) {
                          insideCoords.push(start);
                        }
                        if (
                          booleanWithin(
                            lineString([end, end]),
                            clipFeature as Feature<Polygon>
                          ) &&
                          !insideCoords.some((coord) => arraysEqual(coord, end))
                        ) {
                          insideCoords.push(end);
                        }
                      }
                    }

                    // Step 6: Create a new segment if valid inside coordinates exist
                    if (insideCoords.length > 1) {
                      const clippedSegment: Feature<LineString> = lineString(
                        insideCoords,
                        segment.properties
                      );
                      resultFeatures.push(clippedSegment);
                    }
                  }
                });
              }
            }
          }

          // Handle Polygon and MultiPolygon geometries
          else if (
            inputFeature.geometry?.type === "Polygon" ||
            inputFeature.geometry?.type === "MultiPolygon"
          ) {
            const intersection = intersect({
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: inputFeature.geometry,
                  properties: inputFeature.properties || {},
                },
                {
                  type: "Feature",
                  geometry: clipFeature.geometry,
                  properties: clipFeature.properties || {},
                },
              ],
            });

            if (intersection) {
              resultFeatures.push(intersection);
            }
          }
        });
      });

      if (resultFeatures.length === 0) {
        setErrorMessage("No intersections found and no features clipped.");
        return false;
      }

      const newGeojson: FeatureCollection = {
        type: "FeatureCollection",
        features: resultFeatures,
      };

      addLayer(newGeojson, getRandomColor(), outputLayerName, true);
      enqueueSnackbar("Clipping operation successful!", {
        variant: "success",
        autoHideDuration: 2500,
      });
      setErrorMessage("");
      return true;
    } catch (error) {
      console.error("Error during clipping:", error);
      setErrorMessage("An error occurred during the clipping operation.");
      return false;
    }
  };

  const handleSubmit = () => {
    if (executeClip()) {
      onClose();
    }
  };

  const handleLayerChange = (event: SelectChangeEvent<unknown>) => {
    const selectedId = event.target.value as string; // Cast to string
    setSelectedLayerId(selectedId);
    setLayerSelectionError(false);

    // Update the output layer name based on the selected feature layer and clip layer
    if (!isOutputNameModified && clipLayerId) {
      const selectedLayer = allLayers.find((layer) => layer.id === selectedId);
      const clipLayer = polygonLayers.find((layer) => layer.id === clipLayerId);

      if (selectedLayer && clipLayer) {
        setOutputLayerName(`${selectedLayer.name}_ClippedTo_${clipLayer.name}`);
      }
    }
  };

  const handleClipLayerChange = (event: SelectChangeEvent<unknown>) => {
    const selectedClipLayerId = event.target.value as string; // Cast to string
    setClipLayerId(selectedClipLayerId);
    setClipLayerSelectionError(false);

    // Update the output layer name based on the selected feature layer and clip layer
    if (!isOutputNameModified) {
      const selectedLayer = allLayers.find(
        (layer) => layer.id === selectedLayerId
      );
      const selectedClipLayer = polygonLayers.find(
        (layer) => layer.id === selectedClipLayerId
      );

      if (selectedLayer && selectedClipLayer) {
        setOutputLayerName(
          `${selectedLayer.name}_ClippedTo_${selectedClipLayer.name}`
        );
      }
    }
  };

  const handleOutputLayerNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOutputLayerName(e.target.value);
    setIsOutputNameModified(true);
  };

  const handleJoyrideStart = () => setIsJoyrideOpen(true);
  const joyrideSteps: Step[] = [
    {
      target: "#clip-header",
      content:
        "Now you are going to find the nearby forested areas by clipping the forest layer to the new buffer layer.",
      disableBeacon: true,
      spotlightClicks: true,
      placement: "bottom",
    },
    {
      target: "#layer-select",
      content: "Select 'skog' from the dropdown list as layer to clip.",
      disableBeacon: true,
      spotlightClicks: true,
      placement: "top",
      styles: {
        overlay: {
          pointerEvents: "none",
        },
      },
    },
    {
      target: "#clip-layer",
      content:
        "Select 'buffer_3km' from the dropdown list as the polygon to clip to.",
      disableBeacon: true,
      spotlightClicks: true,
      placement: "top",
      styles: {
        overlay: {
          pointerEvents: "none",
        },
      },
    },
    {
      target: "#output-layer-name",
      content: "Name the new buffer layer 'skog_3km'.",
      disableBeacon: true,
      spotlightClicks: true,
      placement: "bottom",
    },
    {
      target: "#submit-button",
      content: "Click to execute clip and create the new layer.",
      disableBeacon: true,
      spotlightClicks: true,
      placement: "bottom",
    },
  ];

  return (
    <>
      <ModalContainer
        open={open}
        onClose={onClose}
        header="Clip Tool"
        headerId="clip-header"
        submitLabel="Execute Clip"
        onSubmit={handleSubmit}
        headermargin={0.5}
        tutorialHelp={true}
        openTutorial={handleJoyrideStart}
      >
        <Box sx={{ mb: 3 }}>
          <Typography mx={{ fontSize: "0.7rem", color: "#ECAC7A", mb: 2 }}>
            Select a layer to clip and a polygon layer to clip to
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
          error={layerSelectionError}
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
            Select Layer to Clip
          </InputLabel>
          <Select
            id="layer-select"
            value={selectedLayerId}
            onChange={handleLayerChange}
            renderValue={(selected) => {
              const layer = allLayers.find((layer) => layer.id === selected);
              return layer?.name || selected;
            }}
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
            {allLayers.map((layer) => (
              <MenuItem
                key={layer.id}
                value={layer.id}
                sx={{ color: "#ffffff" }}
              >
                {layer.name}
              </MenuItem>
            ))}
          </Select>

          {layerSelectionError && (
            <div
              style={{ color: "#d32f2f", marginTop: "4px", fontSize: "12px" }}
            >
              Please select at least one layer.
            </div>
          )}
        </FormControl>

        <CustomSelectField
          id="clip-layer"
          label="Select Polygon to Clip To"
          value={clipLayerId}
          options={polygonLayers.map((layer) => ({
            value: layer.id,
            label: layer.name,
          }))}
          onChange={handleClipLayerChange}
          error={clipLayerSelectionError}
          helperText={
            clipLayerSelectionError
              ? "Please select a polygon layer to clip to."
              : ""
          }
        />

        <CustomTextField
          id="output-layer-name"
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

      {/* React Joyride */}
      <TutorialDetails
        steps={joyrideSteps}
        run={open && isJoyrideOpen}
        onClose={() => setIsJoyrideOpen(false)}
      />
    </>
  );
};

export default ClipTool;
