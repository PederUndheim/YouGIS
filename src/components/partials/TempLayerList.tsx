import React from "react";
import { Box, Typography } from "@mui/material";
import { useTempLayerContext } from "../../context/TempLayerContext";
import TempLayerListItem from "./TempLayerListItem";

const TempLayerList: React.FC = () => {
  const { tempLayers, removeLayer, updateTempLayerName, updateTempLayerColor } =
    useTempLayerContext();

  return (
    <Box
      sx={{
        maxHeight: "300px",
        overflowY: "auto",
        borderRadius: "8px",
        p: 2,
      }}
    >
      {tempLayers.length === 0 ? (
        <Typography variant="body2" sx={{ color: "#A8D99C" }}>
          No layers added yet.
        </Typography>
      ) : (
        tempLayers.map((layer) => (
          <TempLayerListItem
            key={layer.id}
            layer={layer}
            index={tempLayers.indexOf(layer)}
            deleteLayer={removeLayer}
            updateTempLayerColor={updateTempLayerName}
            updateTempLayerName={updateTempLayerColor}
            selected={false}
          />
        ))
      )}
    </Box>
  );
};

export default TempLayerList;
