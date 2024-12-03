import React from "react";
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
  useLayerActionContext,
  useLayerDataContext,
  useSelectedLayerContext,
} from "../../context/LayerContext";

interface DeleteLayerModalProps {
  open: boolean;
  onClose: () => void;
}

const DeleteLayerModal: React.FC<DeleteLayerModalProps> = ({
  open,
  onClose,
}) => {
  const { removeLayer } = useLayerActionContext();
  const { layers } = useLayerDataContext();
  const { selectedLayerIds, deselectLayer } = useSelectedLayerContext();

  const selectedLayers = layers.filter((layer) =>
    selectedLayerIds.includes(layer.id)
  );

  const handleRemoveFromSelection = (layerId: string) => {
    deselectLayer(layerId); // Remove the layer from the selection list
  };

  const handleDeleteLayers = () => {
    selectedLayers.forEach((layer) => removeLayer(layer.id));
    onClose();
  };

  return (
    <ModalContainer
      open={open}
      onClose={onClose}
      header="Delete Selected Layers"
      submitLabel="Delete"
      onSubmit={handleDeleteLayers}
      disableSubmit={selectedLayers.length === 0}
      modalWidth={400}
    >
      {selectedLayers.length === 0 ? (
        <Typography>No layers selected for deletion.</Typography>
      ) : (
        <Box>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to delete the following layers?
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

export default DeleteLayerModal;
