import React, { useState } from "react";
import { Divider, Toolbar, Box, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import TableViewIcon from "@mui/icons-material/TableView";
import AppLogo from "../../assets/YouGis.svg";
import SidebarActionButton from "../ui/SidebarActionButton";
import DeleteLayerModal from "../modals/DeleteLayerModal";
import DownloadLayerModal from "../modals/DownloadLayerModal";
import AttributeTableModal from "../modals/AttributeTableModal";
import {
  useLayerActionContext,
  useLayerDataContext,
} from "../../context/LayerContext";

interface SidebarTopSectionProps {
  onOpenAddLayerModal: () => void;
}

const SidebarTopSection: React.FC<SidebarTopSectionProps> = ({
  onOpenAddLayerModal,
}) => {
  const { toggleAllLayersVisibility } = useLayerActionContext();
  const { layers } = useLayerDataContext();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDownloadModalOpen, setDownloadModalOpen] = useState(false);
  const [isTableModalOpen, setTableModalOpen] = useState(false);
  const hasLayers = layers.length > 0;

  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);
  const openDownloadModal = () => setDownloadModalOpen(true);
  const closeDownloadModal = () => setDownloadModalOpen(false);

  const openTableModal = () => {
    if (layers.length > 0) {
      setTableModalOpen(true);
    }
  };

  const closeTableModal = () => {
    setTableModalOpen(false);
  };

  return (
    <>
      <Toolbar>
        <img
          src={AppLogo}
          alt="App Logo"
          style={{ width: "170px", height: "70px" }}
        />
      </Toolbar>
      <Divider
        textAlign="left"
        sx={{
          "&::before, &::after": { borderColor: "#ECAC7A" },
        }}
      >
        <Chip
          label="Map Layers"
          size="medium"
          sx={{
            backgroundColor: "#A8D99C",
            color: "black",
            height: 20,
          }}
        />
      </Divider>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          paddingY: 1,
          paddingX: 2,
        }}
      >
        <SidebarActionButton
          id="add-layer-button"
          icon={
            <AddIcon
              sx={{
                color: "white",
                fontSize: "28px",
                "&:hover": {
                  color: "#A8D99C",
                },
              }}
            />
          }
          tooltipTitle="Add Layer"
          onClick={onOpenAddLayerModal}
        />

        <Divider orientation="vertical" sx={{ height: 24 }} />

        <SidebarActionButton
          icon={
            <TableViewIcon
              sx={{
                width: "24px",
                height: "24px",
              }}
            />
          }
          tooltipTitle="Show Attribute Table"
          onClick={() => openTableModal()}
          disabled={!hasLayers}
        />

        <Divider orientation="vertical" sx={{ height: 24 }} />

        <SidebarActionButton
          icon={<DownloadIcon sx={{ width: "24px", height: "24px" }} />}
          tooltipTitle="Download Selected Layer(s)"
          onClick={() => openDownloadModal()}
          disabled={!hasLayers}
        />

        <SidebarActionButton
          icon={
            hasLayers && layers.every((layer) => layer.visible) ? (
              <VisibilityIcon sx={{ width: "24px", height: "24px" }} />
            ) : (
              <VisibilityOffIcon
                sx={{ width: "24px", height: "24px", color: "grey" }}
              />
            )
          }
          tooltipTitle={
            hasLayers && layers.every((layer) => layer.visible)
              ? "Hide All Layers"
              : "Show All Layers"
          }
          onClick={() => toggleAllLayersVisibility()}
          disabled={!hasLayers}
        />

        <SidebarActionButton
          icon={
            <DeleteIcon
              sx={{
                width: "24px",
                height: "24px",
                "&:hover": {
                  color: "#ECAC7A",
                },
              }}
            />
          }
          tooltipTitle="Delete Selected Layer(s)"
          onClick={() => openDeleteModal()}
          disabled={!hasLayers}
        />
      </Box>
      <Divider />
      {/* Delete Layer Modal */}
      <DeleteLayerModal open={isDeleteModalOpen} onClose={closeDeleteModal} />

      {/* Download Layer Modal */}
      <DownloadLayerModal
        open={isDownloadModalOpen}
        onClose={closeDownloadModal}
      />

      {/* Attribute Table Modal */}
      <AttributeTableModal
        open={isTableModalOpen}
        onClose={closeTableModal}
        layers={layers}
        initialSelectedLayerId={null}
      />
    </>
  );
};

export default SidebarTopSection;
