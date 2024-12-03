import React, { useState } from "react";
import { IconButton, ListItemButton, ListItemText, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { TempLayer } from "../../types";
import EditTempLayerModal from "../modals/EditTempLayerModal";
import LayerIcon from "../ui/LayerIcon";

interface TempLayerListItemProps {
  layer: TempLayer;
  index: number;
  deleteLayer: (layerId: string) => void;
  updateTempLayerColor: (layerId: string, newColor: string) => void;
  updateTempLayerName: (layerId: string, newName: string) => void;
  selected: boolean;
}

const TempLayerListItem: React.FC<TempLayerListItemProps> = ({
  layer,
  deleteLayer,
  selected,
}) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  return (
    <Box>
      <ListItemButton selected={selected} sx={{ padding: 1 }} key={layer.id}>
        {/* Layer Type and Color Representation */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "30px",
            height: "30px",
          }}
        >
          <LayerIcon layerId={layer.id} size={24} isTempLayers />{" "}
        </Box>

        {/* Layer Name */}
        <ListItemText primary={layer.name} sx={{ pl: "2px" }} />

        {/* Edit Layer Button */}
        <IconButton
          onClick={() => setEditModalOpen(true)}
          aria-label="Edit layer"
        >
          <EditIcon
            sx={{
              fontSize: 18,
              color: "white",
              "&:hover": {
                color: "#A8D99C",
              },
            }}
          />
        </IconButton>

        {/* Delete Layer */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            deleteLayer(layer.id);
          }}
          aria-label="Delete"
        >
          <DeleteIcon
            sx={{
              fontSize: 18,
              color: "white",
              "&:hover": {
                color: "#ECAC7A",
              },
            }}
          />
        </IconButton>
      </ListItemButton>

      <EditTempLayerModal
        open={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        layerId={layer.id}
      />
    </Box>
  );
};

export default TempLayerListItem;
