import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Slider } from "@mui/material";
import {
  useLayerActionContext,
  useLayerDataContext,
} from "../../context/LayerContext";
import ModalContainer from "../containers/ModalContainer";
import CustomTextField from "../ui/CustomTextField";
import { Step } from "react-joyride";
import TutorialDetails from "../tutorial/DetailedTutorial";

interface EditLayerModalProps {
  open: boolean;
  onClose: () => void;
  layerId: string;
}

const EditLayerModal: React.FC<EditLayerModalProps> = ({
  open,
  onClose,
  layerId,
}) => {
  const { layers } = useLayerDataContext();
  const { updateLayerStyle } = useLayerActionContext();
  const [layerName, setLayerName] = useState("");
  const [layerColor, setLayerColor] = useState("");
  const [layerOpacity, setLayerOpacity] = useState(1);
  const [isJoyrideOpen, setIsJoyrideOpen] = useState(false);

  useEffect(() => {
    const layer = layers.find((layer) => layer.id === layerId);
    if (layer) {
      setLayerName(layer.name);
      setLayerColor(layer.color);
      setLayerOpacity(layer.opacity);
    }
  }, [layerId, layers]);

  const handleSubmit = () => {
    updateLayerStyle(layerId, layerColor, layerOpacity, layerName);
    onClose();
  };

  const handleJoyrideStart = () => setIsJoyrideOpen(true);
  const joyrideSteps: Step[] = [
    {
      target: "#layer-name",
      content: "Edit the name of the layer here.",
      disableBeacon: true,
      spotlightClicks: true,
      placement: "bottom",
    },
    {
      target: "#layer-color",
      content: "Click on the colored box to change the layer color.",
      disableBeacon: true,
      spotlightClicks: true,
      placement: "bottom",
    },
    {
      target: "#layer-opacity",
      content: "Use this slider to adjust the layer opacity.",
      disableBeacon: true,
      spotlightClicks: true,
      placement: "bottom",
    },
    {
      target: "#submit-button",
      content: "Click here to save the changes to the layer.",
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
        header="Edit Layer"
        headerId="edit-layer-header"
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
        tutorialHelp={true}
        openTutorial={handleJoyrideStart}
      >
        {/* Use CustomTextField for Layer Name */}
        <CustomTextField
          id="layer-name"
          label="Layer Name"
          value={layerName}
          onChange={(e) => setLayerName(e.target.value)}
        />

        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          {/* Standard TextField for Layer Color */}
          <TextField
            id="layer-color"
            label="Layer Color"
            variant="standard"
            type="color"
            value={layerColor}
            onChange={(e) => setLayerColor(e.target.value)}
            sx={{
              flex: 1,
              "& .MuiInput-root": {
                backgroundColor: "#555555",
                borderBottom: "none",
                "&:before": {
                  borderBottomColor: "transparent",
                },
                "&:hover:not(.Mui-disabled):before": {
                  borderBottomColor: "transparent",
                },
                "&:after": {
                  borderBottomColor: "transparent",
                },
                "& input[type='color']": {
                  padding: 0,
                  width: "66px",
                  height: "50px",
                  border: "none",
                  cursor: "pointer",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#A8D99C",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#A8D99C",
              },
            }}
          />

          {/* Opacity Slider */}
          <Box sx={{ flex: 2, ml: 2 }}>
            <Typography
              gutterBottom
              sx={{ color: "#A8D99C", fontSize: "12px" }}
            >
              Opacity: {layerOpacity.toFixed(2)}
            </Typography>
            <Slider
              id="layer-opacity"
              value={layerOpacity}
              min={0}
              max={1}
              step={0.01}
              onChange={(_, newValue) => setLayerOpacity(newValue as number)}
              sx={{
                color: "#ECAC7A",
                "& .MuiSlider-thumb": {
                  backgroundColor: "#ECAC7A",
                  borderRadius: "50%",
                  height: 16,
                  width: 16,
                  "&:hover": {
                    boxShadow: "0 0 0 5px rgba(168, 217, 156, 0.4)",
                  },
                },
                "& .MuiSlider-track": {
                  height: 4,
                  border: "none",
                },
                "& .MuiSlider-rail": {
                  height: 4,
                  borderRadius: "4px",
                  backgroundColor: "#ECAC7A",
                },
              }}
            />
          </Box>
        </Box>
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

export default EditLayerModal;
