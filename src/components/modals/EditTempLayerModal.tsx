import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Slider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTempLayerContext } from "../../context/TempLayerContext";

interface EditTempLayerModalProps {
  open: boolean;
  onClose: () => void;
  layerId: string;
}

const EditTempLayerModal: React.FC<EditTempLayerModalProps> = ({
  open,
  onClose,
  layerId,
}) => {
  const { tempLayers, updateTempLayerName, updateTempLayerColor } =
    useTempLayerContext();
  const [layerName, setLayerName] = useState("");
  const [layerColor, setLayerColor] = useState("");
  const [layerOpacity, setLayerOpacity] = useState<number>(1);

  useEffect(() => {
    const layer = tempLayers.find((layer) => layer.id === layerId);
    if (layer) {
      setLayerName(layer.name);
      setLayerColor(layer.color);
      setLayerOpacity(layer.opacity);
    }
  }, [layerId, tempLayers]);

  const handleSubmit = () => {
    updateTempLayerName(layerId, layerName);
    updateTempLayerColor(layerId, layerColor);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#555555",
          color: "#ffffff",
          boxShadow: 24,
          p: 4,
          borderRadius: "8px",
          width: 400,
          paddingTop: 3,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "#ffffff",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" sx={{ mb: 3 }}>
          Edit Temp Layer
        </Typography>

        <TextField
          fullWidth
          label="Layer Name"
          variant="standard"
          value={layerName}
          onChange={(e) => setLayerName(e.target.value)}
          sx={{
            mb: 3,
            "& .MuiInput-root": {
              color: "#ffffff",
              backgroundColor: "#555555",
              "&:before": {
                borderBottomColor: "#ffffff",
              },
              "&:hover:not(.Mui-disabled):before": {
                borderBottomColor: "#A8D99C",
              },
              "&:after": {
                borderBottomColor: "#A8D99C",
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

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            label="Layer Color"
            variant="standard"
            type="color"
            value={layerColor}
            onChange={(e) => setLayerColor(e.target.value)}
            sx={{
              mt: 2,
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
          <Box sx={{ flex: 2 }}>
            <Typography
              gutterBottom
              sx={{ color: "#A8D99C", fontSize: "12px" }}
            >
              Opacity: {layerOpacity.toFixed(2)}
            </Typography>
            <Box
              sx={{
                backgroundColor: "#555555",
                borderRadius: "4px",
                "& .MuiSlider-root": {
                  color: "#ECAC7A",
                },
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
            >
              <Slider
                value={layerOpacity}
                min={0}
                max={1}
                step={0.01}
                onChange={(_, newValue) => setLayerOpacity(newValue as number)}
              />
            </Box>
          </Box>
        </Box>

        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: "#ECAC7A",
              color: "#ECAC7A",
              mr: 2,
              "&:hover": {
                backgroundColor: "rgba(236, 172, 122, 0.1)",
                borderColor: "#E59548",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#A8D99C",
              color: "#000",
              "&:hover": {
                backgroundColor: "#89C287",
              },
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditTempLayerModal;
