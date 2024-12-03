import React, { useState } from "react";
import ModalContainer from "../containers/ModalContainer";
import CustomTextField from "../ui/CustomTextField";
import CustomSelectField from "../ui/CustomSelectField";
import {
  useLayerDataContext,
  useLayerActionContext,
} from "../../context/LayerContext";
import { buffer } from "@turf/turf";
import { getRandomColor } from "../../utils/colorUtils";
import { Step } from "react-joyride";
import TutorialDetails from "../tutorial/DetailedTutorial";
import { SelectChangeEvent } from "@mui/material";
import { FeatureCollection } from "geojson";
import { useSnackbar } from "notistack";

interface BufferToolProps {
  open: boolean;
  onClose: () => void;
}

const BufferTool: React.FC<BufferToolProps> = ({ open, onClose }) => {
  const { layers } = useLayerDataContext();
  const { addLayer } = useLayerActionContext();
  const [selectedLayerId, setSelectedLayerId] = useState<string>("");
  const [bufferRadius, setBufferRadius] = useState<string>("");
  const [outputLayerName, setOutputLayerName] = useState<string>("");
  const [radiusError, setRadiusError] = useState<boolean>(false);
  const [layerSelectionError, setLayerSelectionError] =
    useState<boolean>(false);
  const [outputLayerNameError, setOutputLayerNameError] =
    useState<boolean>(false);
  const [isOutputLayerNameModified, setIsOutputLayerNameModified] =
    useState<boolean>(false);
  const [isJoyrideOpen, setIsJoyrideOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const validateInputs = () => {
    const isLayerSelected = selectedLayerId !== "";
    const isRadiusValid =
      bufferRadius !== "" &&
      !isNaN(Number(bufferRadius)) &&
      Number(bufferRadius) > 0;
    const isOutputLayerNameValid = outputLayerName !== "";

    setLayerSelectionError(!isLayerSelected);
    setRadiusError(!isRadiusValid);
    setOutputLayerNameError(!isOutputLayerNameValid);

    return isLayerSelected && isRadiusValid && isOutputLayerNameValid;
  };

  const createBuffer = () => {
    const selectedLayer = layers.find((layer) => layer.id === selectedLayerId);

    if (selectedLayer) {
      try {
        const buffered = buffer(selectedLayer.data, Number(bufferRadius), {
          units: "meters",
        });

        if (buffered.type !== "FeatureCollection") {
          throw new Error("Buffering did not produce a FeatureCollection.");
        }

        const newLayer = {
          id: outputLayerName || `${selectedLayerId}_buffer`,
          name: outputLayerName || `${selectedLayer.name}_buffer`,
          data: buffered as FeatureCollection, // Safely cast to FeatureCollection
          color: getRandomColor(),
          visible: true,
          opacity: 1,
          type: "Polygon",
        };

        addLayer(newLayer.data, newLayer.color, newLayer.name, true);
        enqueueSnackbar("Buffer layer added successfully!", {
          variant: "success",
          autoHideDuration: 2500,
        });
      } catch (error) {
        console.error("Buffering error:", error);
      }
    }
  };

  const handleSubmit = () => {
    if (validateInputs()) {
      createBuffer();
      onClose();
    }
  };

  const handleLayerChange = (event: SelectChangeEvent<unknown>) => {
    const layerId = event.target.value as string; // Assert that value is string
    setSelectedLayerId(layerId);
    setLayerSelectionError(false);

    const selectedLayer = layers.find((layer) => layer.id === layerId);
    if (selectedLayer && !isOutputLayerNameModified) {
      setOutputLayerName(`${selectedLayer.name}_buffer`);
    }
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBufferRadius(e.target.value);
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
      target: "#buffer-header",
      content:
        "Now you are going to make a buffer of 3 km around Solvangen kindergarten.",
      disableBeacon: true,
      spotlightClicks: true,
      placement: "bottom",
    },
    {
      target: "#layer-select",
      content: "Select 'Solvangen barnehage' from the dropdown list.",
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
      target: "#buffer-radius",
      content: "Write '3000' in the buffer radius field.",
      disableBeacon: true,
      spotlightClicks: true,
      placement: "bottom",
    },
    {
      target: "#output-layer-name",
      content: "Name the new buffer layer 'buffer_3km'.",
      disableBeacon: true,
      spotlightClicks: true,
      placement: "bottom",
    },
    {
      target: "#submit-button",
      content: "Click to create layer with the selected row.",
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
        header="Create Buffer"
        headerId="buffer-header"
        submitLabel="Create Buffer"
        onSubmit={handleSubmit}
        tutorialHelp={true}
        openTutorial={handleJoyrideStart}
      >
        <CustomSelectField
          id="layer-select"
          label="Select Layer"
          value={selectedLayerId}
          options={layers.map((layer) => ({
            value: layer.id,
            label: layer.name,
          }))}
          onChange={handleLayerChange}
          error={layerSelectionError}
          helperText={layerSelectionError ? "Please select a valid layer." : ""}
        />

        <CustomTextField
          id="buffer-radius"
          label="Buffer Radius (meters)"
          type="text"
          value={bufferRadius}
          onChange={handleRadiusChange}
          error={radiusError}
          helperText={
            radiusError ? "Please enter a valid positive number." : ""
          }
          InputLabelProps={{
            shrink: true,
          }}
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

export default BufferTool;
