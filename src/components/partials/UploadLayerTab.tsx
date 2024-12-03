import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { getRandomColor } from "../../utils/colorUtils";
import { useTempLayerContext } from "../../context/TempLayerContext";

interface UploadLayerTabProps {
  onFilesUploaded: () => void;
}

const UploadLayerTab: React.FC<UploadLayerTabProps> = ({ onFilesUploaded }) => {
  const { addTempLayer } = useTempLayerContext();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files || []);
    for (const file of selectedFiles) {
      const text = await file.text();
      const geojsonData = JSON.parse(text);
      addTempLayer(geojsonData, file.name.split(".")[0], getRandomColor());
    }
    onFilesUploaded();
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    for (const file of droppedFiles) {
      const text = await file.text();
      const geojsonData = JSON.parse(text);
      addTempLayer(geojsonData, file.name.split(".")[0], getRandomColor());
    }
    onFilesUploaded();
  };

  return (
    <Box>
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          border: "2px dashed",
          borderColor: isDragOver ? "#ECAC7A" : "#A8D99C",
          backgroundColor: isDragOver ? "#666666" : "#555555",
          borderRadius: "8px",
          p: 2,
          textAlign: "center",
          mb: 1,
          mt: 1,
        }}
      >
        <FileUploadIcon sx={{ fontSize: 40, mb: 1 }} />
        <Typography>Drag and drop GeoJSON/JSON file(s) here</Typography>
        <Typography>or</Typography>
        <Button
          id="file-upload"
          component="label"
          variant="contained"
          sx={{
            mt: 1,
            backgroundColor: "#A8D99C",
            color: "#000",
            "&:hover": {
              backgroundColor: "#89C287",
            },
          }}
        >
          Browse Files
          <input
            type="file"
            accept=".json, .geojson"
            onChange={handleFileChange}
            multiple
            style={{ display: "none" }}
          />
        </Button>
      </Box>
    </Box>
  );
};

export default UploadLayerTab;
