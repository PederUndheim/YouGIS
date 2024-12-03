import React, { useState } from "react";
import { Typography, Box } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { getRandomColor } from "../../utils/colorUtils";
import { useSnackbar } from "notistack";
import {
  useLayerDataContext,
  useLayerActionContext,
} from "../../context/LayerContext";
import ModalContainer from "../containers/ModalContainer";
import CustomTextField from "../ui/CustomTextField";
import CustomSelectField from "../ui/CustomSelectField";
import { FeatureCollection, Polygon, MultiPolygon, Feature } from "geojson";
import { Step } from "react-joyride";
import TutorialDetails from "../tutorial/DetailedTutorial";

export interface TurfPolygonToolProps {
  open: boolean;
  onClose: () => void;
  operationLabel: string;
  turfFunction: (
    features: FeatureCollection<Polygon | MultiPolygon>
  ) => Feature<Polygon | MultiPolygon> | null;
}

const TurfPolygonTool: React.FC<TurfPolygonToolProps> = ({
  open,
  onClose,
  operationLabel,
  turfFunction,
}) => {
  const { layers } = useLayerDataContext();
  const { addLayer } = useLayerActionContext();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedLayer1Id, setSelectedLayer1Id] = useState<string>("");
  const [selectedLayer2Id, setSelectedLayer2Id] = useState<string>("");
  const [outputLayerName, setOutputLayerName] = useState<string>("");
  const [layer1SelectionError, setLayer1SelectionError] =
    useState<boolean>(false);
  const [layer2SelectionError, setLayer2SelectionError] =
    useState<boolean>(false);
  const [outputLayerNameError, setOutputLayerNameError] =
    useState<boolean>(false);
  const [isOutputLayerNameModified, setIsOutputLayerNameModified] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isJoyrideOpen, setIsJoyrideOpen] = useState(false);

  const polygonLayers = layers.filter(
    (layer) => layer.type === "Polygon" || layer.type === "MultiPolygon"
  );

  // Validate inputs
  const validateInputs = () => {
    const isLayer1Selected = selectedLayer1Id !== "";
    const isLayer2Selected =
      selectedLayer2Id !== "" && selectedLayer2Id !== selectedLayer1Id;
    const isOutputLayerNameValid = outputLayerName !== "";

    setLayer1SelectionError(!isLayer1Selected);
    setLayer2SelectionError(!isLayer2Selected);
    setOutputLayerNameError(!isOutputLayerNameValid);

    return isLayer1Selected && isLayer2Selected && isOutputLayerNameValid;
  };

  const executeOperation = (): boolean => {
    const layer1 = polygonLayers.find((layer) => layer.id === selectedLayer1Id);
    const layer2 = polygonLayers.find((layer) => layer.id === selectedLayer2Id);

    // Check if layers are found
    if (!layer1 || !layer2) {
      setErrorMessage("One or both layers could not be found.");
      return false;
    }

    try {
      const resultFeatures: Feature<Polygon | MultiPolygon>[] = [];
      const layer1Features = layer1.data.features.filter(
        (feature) =>
          feature.geometry?.type === "Polygon" ||
          feature.geometry?.type === "MultiPolygon"
      ) as Feature<Polygon | MultiPolygon>[];

      const layer2Features = layer2.data.features.filter(
        (feature) =>
          feature.geometry?.type === "Polygon" ||
          feature.geometry?.type === "MultiPolygon"
      ) as Feature<Polygon | MultiPolygon>[];

      layer1Features.forEach((feature1) => {
        layer2Features.forEach((feature2) => {
          const tempFeatureCollection: FeatureCollection<
            Polygon | MultiPolygon
          > = {
            type: "FeatureCollection",
            features: [feature1, feature2],
          };

          const result = turfFunction(tempFeatureCollection);

          if (result) {
            resultFeatures.push(result);
          }
        });
      });

      if (resultFeatures.length > 0) {
        const newGeojson: FeatureCollection<Polygon | MultiPolygon> = {
          type: "FeatureCollection",
          features: resultFeatures,
        };

        addLayer(newGeojson, getRandomColor(), outputLayerName, true);
        enqueueSnackbar(`${operationLabel} layer added successfully!`, {
          variant: "success",
          autoHideDuration: 2500,
        });
        setErrorMessage("");
        return true;
      } else {
        setErrorMessage(`No ${operationLabel} results found.`);
        return false;
      }
    } catch (error) {
      setErrorMessage(`An error occurred during ${operationLabel}.`);
      return false;
    }
  };

  const handleSubmit = () => {
    if (validateInputs()) {
      const success = executeOperation();
      if (success) {
        onClose();
      }
    }
  };

  const handleLayer1Change = (event: SelectChangeEvent<unknown>) => {
    const layerId = event.target.value as string;
    setSelectedLayer1Id(layerId);
    setLayer1SelectionError(false);

    const layer1 = polygonLayers.find((layer) => layer.id === layerId);
    const layer2 = polygonLayers.find((layer) => layer.id === selectedLayer2Id);
    if (layer1 && selectedLayer2Id !== "" && !isOutputLayerNameModified) {
      setOutputLayerName(`${layer1.name}_${layer2?.name}_${operationLabel}`);
      setOutputLayerNameError(false);
    }
  };

  const handleLayer2Change = (event: SelectChangeEvent<unknown>) => {
    const layerId = event.target.value as string;
    setSelectedLayer2Id(layerId);
    setLayer2SelectionError(false);

    const layer2 = polygonLayers.find((layer) => layer.id === layerId);
    const layer1 = polygonLayers.find((layer) => layer.id === selectedLayer1Id);
    if (layer2 && selectedLayer1Id !== "" && !isOutputLayerNameModified) {
      setOutputLayerName(`${layer2.name}_${layer1?.name}_${operationLabel}`);
      setOutputLayerNameError(false);
    }
  };

  const handleOutputLayerNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOutputLayerName(e.target.value);
    setIsOutputLayerNameModified(true);
  };

  const handleJoyrideStart = () => setIsJoyrideOpen(true);
  const joyrideSteps: Step[] = [
    {
      target: "#operation-header",
      content:
        "Now you are going to find forested areas close to a lake by creating the intersection of the nearby forest areas and the lake-buffer.",
      disableBeacon: true,
      spotlightClicks: true,
      placement: "bottom",
    },
    {
      target: "#first-layer",
      content: "Select 'skog_3km' from the dropdown list as first layer.",
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
      target: "#second-layer",
      content: "Select 'innsjø_100m' from the dropdown list as second layer.",
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
      content: "Name the new intersection layer 'skog_potensiell'.",
      disableBeacon: true,
      spotlightClicks: true,
      placement: "bottom",
    },
    {
      target: "#submit-button",
      content: "Click to execute intersection and create the new layer.",
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
        header={`Create ${operationLabel}`}
        headerId="operation-header"
        submitLabel={`Create ${operationLabel}`}
        onSubmit={handleSubmit}
        headermargin={0.5}
        tutorialHelp={operationLabel === "Intersection" ? true : false}
        openTutorial={handleJoyrideStart}
      >
        <Box sx={{ mb: 3 }}>
          <Typography mx={{ fontSize: "0.7rem", color: "#ECAC7A", mb: 2 }}>
            Polygon layers only
          </Typography>
          {errorMessage && (
            <Typography sx={{ color: "red", fontSize: "0.8rem" }}>
              {errorMessage}
            </Typography>
          )}
        </Box>

        <CustomSelectField
          id="first-layer"
          label="Select First Layer"
          value={selectedLayer1Id}
          options={polygonLayers.map((layer) => ({
            value: layer.id,
            label: layer.name,
          }))}
          onChange={handleLayer1Change}
          error={layer1SelectionError}
          helperText={
            layer1SelectionError ? "Please select a valid first layer." : ""
          }
        />

        <CustomSelectField
          id="second-layer"
          label={
            operationLabel === "Difference"
              ? "Select Layer to Subtract"
              : "Select Second Layer"
          }
          value={selectedLayer2Id}
          options={polygonLayers
            .filter((layer) => layer.id !== selectedLayer1Id)
            .map((layer) => ({
              value: layer.id,
              label: layer.name,
            }))}
          onChange={handleLayer2Change}
          error={layer2SelectionError}
          helperText={
            layer2SelectionError
              ? "Please select a different layer for the operation."
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

export default TurfPolygonTool;
