import React, { useState } from "react";
import {
  IconButton,
  ListItemButton,
  ListItemText,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import DownloadIcon from "@mui/icons-material/Download";
import TableViewIcon from "@mui/icons-material/TableView";
import { GeoJSONLayer } from "../../types";
import EditLayerModal from "../modals/EditLayerModal";
import AttributeTableModal from "../modals/AttributeTableModal";
import LayerIcon from "../ui/LayerIcon";
import {
  useLayerActionContext,
  useLayerDataContext,
} from "../../context/LayerContext";

interface LayerListItemProps {
  layer: GeoJSONLayer;
  index: number;
  deleteLayer: (layerId: string) => void;
  toggleVisibility: (layerId: string) => void;
  updateLayerStyle: (layerId: string, color: string, opacity: number) => void;
  selected: boolean;
  handleListItemClick: (layerId: string, event: React.MouseEvent) => void;
  isDragging?: boolean;
}

const LayerListItem: React.FC<LayerListItemProps> = ({
  layer,
  deleteLayer,
  toggleVisibility,
  selected,
  handleListItemClick,
  isDragging,
}) => {
  const { layers } = useLayerDataContext();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAttributeTableModalOpen, setAttributeTableModalOpen] =
    useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [leftClickAnchor, setLeftClickAnchor] = useState<null | HTMLElement>(
    null
  );
  const [preSelectedLayerId, setPreSelectedLayerId] = useState<string | null>(
    null
  );
  const { zoomToLayer } = useLayerActionContext();

  const handleVisibilityClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleVisibility(layer.id);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLeftClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault(); // Prevent default browser behavior
    handleListItemClick(layer.id, event);
    setLeftClickAnchor(event.currentTarget);
  };

  const handleLeftClickMenuClose = () => {
    setLeftClickAnchor(null);
  };

  const openAttributeTableModal = () => {
    setPreSelectedLayerId(layer.id); // Set the relevant layer as pre-selected
    setAttributeTableModalOpen(true);
    handleMenuClose();
    handleLeftClickMenuClose();
  };

  const handleDownloadLayer = (layer: GeoJSONLayer) => {
    // Create a Blob with the layer data
    const layerData = new Blob([JSON.stringify(layer.data, null, 2)], {
      type: "application/json",
    });

    // Create a temporary link element
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(layerData);
    downloadLink.download = `${layer.name}.geojson`;

    // Trigger the download
    document.body.appendChild(downloadLink); // Append to the DOM to ensure it works in all browsers
    downloadLink.click();
    document.body.removeChild(downloadLink); // Clean up the DOM
  };

  const menuOpen = Boolean(anchorEl);
  const leftClickMenuOpen = Boolean(leftClickAnchor);

  return (
    <Box>
      {/* Main Layer Item */}
      <ListItemButton
        selected={selected}
        sx={{
          padding: 1,
          backgroundColor: selected
            ? "rgba(255, 255, 255, 0.1) !important"
            : "transparent",
          color: selected ? "white" : "inherit",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
          transition: "background-color 0.2s ease-in",
          ...(isDragging && {
            backgroundColor: "#ECAC7A !important",
          }),
        }}
        onClick={(event) => handleListItemClick(layer.id, event)}
        onContextMenu={handleLeftClickMenu}
      >
        {/* Visibility Toggle */}
        <IconButton
          onClick={handleVisibilityClick}
          aria-label="Toggle visibility"
          sx={{
            color: layer.visible ? "white" : "grey",
          }}
        >
          {layer.visible ? (
            <VisibilityIcon sx={{ fontSize: 18 }} />
          ) : (
            <VisibilityOffIcon sx={{ fontSize: 18 }} />
          )}
        </IconButton>

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
          <LayerIcon layerId={layer.id} size={24} />
        </Box>

        {/* Layer Name */}
        <ListItemText
          primary={layer.name}
          sx={{
            pl: "12px",
            flex: 1,
            color: selected ? "white" : "inherit",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        />

        {/* More Options Menu */}
        <IconButton
          aria-label="More options"
          onClick={(e) => {
            e.stopPropagation();
            handleListItemClick(layer.id, e);
            handleMenuClick(e);
          }}
        >
          <MoreHorizIcon
            sx={{
              fontSize: 18,
              color: "white",
            }}
          />
        </IconButton>

        {/* Edit Layer Button */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleListItemClick(layer.id, e);
            setEditModalOpen(true);
          }}
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

        {/* Delete Layer Button */}
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

      {/* More Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "#555555",
            color: "white",
          },
        }}
      >
        <MenuItem
          onClick={openAttributeTableModal}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <TableViewIcon sx={{ mr: 1 }} />
          Attribute Table
        </MenuItem>
        <MenuItem
          onClick={() => {
            zoomToLayer(layer.id);
            handleMenuClose();
          }}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <ZoomInIcon sx={{ mr: 1 }} />
          Zoom to Layer
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleDownloadLayer(layer);
            handleMenuClose();
          }}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <DownloadIcon sx={{ mr: 1 }} />
          Download Layer
        </MenuItem>
      </Menu>

      {/* Left-Click Menu */}
      <Menu
        anchorEl={leftClickAnchor}
        open={leftClickMenuOpen}
        onClose={handleLeftClickMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "#555555",
            color: "white",
          },
        }}
      >
        <MenuItem
          onClick={openAttributeTableModal}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <TableViewIcon sx={{ mr: 1 }} />
          Attribute Table
        </MenuItem>
        <MenuItem
          onClick={() => {
            zoomToLayer(layer.id);
            handleLeftClickMenuClose();
          }}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <ZoomInIcon sx={{ mr: 1 }} />
          Zoom to Layer
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleDownloadLayer(layer);
            handleLeftClickMenuClose();
          }}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <DownloadIcon sx={{ mr: 1 }} />
          Download Layer
        </MenuItem>
        <MenuItem
          onClick={() => {
            setEditModalOpen(true);
            handleLeftClickMenuClose();
          }}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <EditIcon sx={{ mr: 1 }} />
          Edit Layer
        </MenuItem>
        <MenuItem
          onClick={() => {
            deleteLayer(layer.id);
            handleLeftClickMenuClose();
          }}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Layer
        </MenuItem>
      </Menu>

      {/* Edit Layer Modal */}
      <EditLayerModal
        open={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        layerId={layer.id}
      />

      {/* Attribute Table Modal */}
      <AttributeTableModal
        open={isAttributeTableModalOpen}
        onClose={() => setAttributeTableModalOpen(false)}
        layers={layers} // Pass all layers
        initialSelectedLayerId={preSelectedLayerId}
      />
    </Box>
  );
};

export default LayerListItem;
