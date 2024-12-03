import React, { useState } from "react";
import { Box, Modal } from "@mui/material";
import MapContainer from "../containers/MapContainer";
import { FeatureCollection, Geometry } from "geojson";
import CancelButton from "../ui/CancelButton";
import SubmitButton from "../ui/SubmitButton";

interface MapDrawModalProps {
  open: boolean;
  onClose: () => void;
  drawingMode: "Point" | "LineString" | "Polygon" | null;
  onDrawingFinish: (data: FeatureCollection<Geometry>) => void;
  onClear: () => void;
  onConfirm: (data: FeatureCollection<Geometry>) => void;
}

const MapDrawModal: React.FC<MapDrawModalProps> = ({
  open,
  onClose,
  drawingMode,
  onDrawingFinish,
  onConfirm,
}) => {
  const [drawnFeatures, setDrawnFeatures] = useState<
    FeatureCollection<Geometry>
  >({
    type: "FeatureCollection",
    features: [],
  });

  const handleDrawingFinish = (data: FeatureCollection<Geometry>) => {
    setDrawnFeatures((prevState) => ({
      type: "FeatureCollection",
      features: [...prevState.features, ...data.features], // Append new features
    }));
    onDrawingFinish(drawnFeatures); // Pass updated features to parent
  };

  const handleConfirm = () => {
    if (drawnFeatures.features.length > 0) {
      onConfirm(drawnFeatures);
      setDrawnFeatures({ type: "FeatureCollection", features: [] });
    }
    onClose();
  };

  const handleCancel = () => {
    setDrawnFeatures({ type: "FeatureCollection", features: [] });
    onClose();
  };

  const isNotDrawn = drawnFeatures.features.length === 0;

  return (
    <Modal open={open} onClose={handleCancel}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80vw",
          height: "80vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <MapContainer
          drawingMode={drawingMode}
          onDrawingFinish={handleDrawingFinish}
          style={{ height: "100%", width: "100%" }}
        />

        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 1,
          }}
        >
          <CancelButton onClose={handleCancel} />
          <SubmitButton
            label={"Add layer"}
            handleSubmit={handleConfirm}
            disabled={isNotDrawn}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default MapDrawModal;
