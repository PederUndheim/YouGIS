import React from "react";
import JSZip from "jszip";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LayerIcon from "../ui/LayerIcon";
import ModalContainer from "../containers/ModalContainer";
import {
  useLayerDataContext,
  useSelectedLayerContext,
} from "../../context/LayerContext";

interface DownloadLayerModalProps {
  open: boolean;
  onClose: () => void;
}

const DownloadLayerModal: React.FC<DownloadLayerModalProps> = ({
  open,
  onClose,
}) => {
  const { layers } = useLayerDataContext();
  const { selectedLayerIds, deselectLayer } = useSelectedLayerContext();

  const selectedLayers = layers.filter((layer) =>
    selectedLayerIds.includes(layer.id)
  );

  const handleRemoveFromSelection = (layerId: string) => {
    deselectLayer(layerId);
  };

  const handleDownloadLayers = async () => {
    const zip = new JSZip();

    selectedLayers.forEach((layer) => {
      const geojsonData = {
        type: "FeatureCollection",
        features: layer.data.features || [],
      };

      // Add each layer as a file to the ZIP
      const fileName = `${layer.name || "layer"}.geojson`;
      zip.file(fileName, JSON.stringify(geojsonData, null, 2));
    });

    if (selectedLayers.length === 0) {
      console.warn("No layers selected for download");
      return;
    }

    // Generate the ZIP file
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // Create a link for downloading the ZIP file
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "geojson_layers.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onClose();
  };

  return (
    <ModalContainer
      open={open}
      onClose={onClose}
      header="Download Selected Layers"
      submitLabel="Download"
      onSubmit={handleDownloadLayers}
      disableSubmit={selectedLayers.length === 0}
      modalWidth={400}
    >
      {selectedLayers.length === 0 ? (
        <Typography>No layers selected for download</Typography>
      ) : (
        <Box>
          <Typography sx={{ mb: 2 }}>
            Do you want to download the following layers?
          </Typography>
          <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
            <List>
              {selectedLayers.map((layer) => (
                <ListItemButton
                  key={layer.id}
                  sx={{
                    padding: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    marginBottom: "8px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Layer Icon */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "30px",
                        height: "30px",
                        marginRight: "12px",
                      }}
                    >
                      <LayerIcon layerId={layer.id} size={24} />
                    </Box>

                    {/* Layer Name */}
                    <ListItemText
                      primary={layer.name}
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "white",
                      }}
                    />
                  </Box>

                  {/* Remove from Selection Button */}
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromSelection(layer.id);
                    }}
                    aria-label="Remove from selection"
                    sx={{
                      color: "#ECAC7A",
                      "&:hover": { color: "#FF6F61" },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Box>
      )}
    </ModalContainer>
  );
};

export default DownloadLayerModal;
