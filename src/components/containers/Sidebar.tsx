import React, { useState, useEffect, useCallback, Suspense } from "react";
import { Drawer, IconButton, Box } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import MapLayerIcon from "../../assets/MapLayerIcon.svg";
import CustomIconButton from "../ui/CustomIconButton";
import SidebarTopSection from "../partials/SidebarTopSection";
import AppLogo from "../../assets/YouGis.svg";
import debounce from "lodash.debounce";
import { useTempLayerContext } from "../../context/TempLayerContext";

// Lazy load the AddLayerModal and LayerList
const AddLayerModal = React.lazy(() => import("../modals/AddLayerModal"));
const LayerList = React.lazy(() => import("../partials/LayerList"));

interface SidebarProps {
  isOpen: boolean;
  currentWidth: number;
  onToggle: () => void;
  onResize: (width: number) => void;
  style?: React.CSSProperties;
}

const MIN_SIDEBAR_WIDTH = 280;
const MAX_SIDEBAR_WIDTH = window.innerWidth / 1.5;

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  currentWidth,
  onToggle,
  onResize,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandleVisible, setDragHandleVisible] = useState(false);
  const [openAddLayerModal, setOpenAddLayerModal] = useState(false);
  const { clearTempLayers } = useTempLayerContext();

  // Debounced resize handler
  const handleResize = useCallback(
    (newWidth: number) => {
      const finalWidth = Math.max(
        MIN_SIDEBAR_WIDTH,
        Math.min(newWidth, MAX_SIDEBAR_WIDTH)
      );
      onResize(finalWidth);
    },
    [onResize]
  );

  // Event listeners for dragging the sidebar
  useEffect(() => {
    const debouncedResize = debounce(handleResize, 0);

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        debouncedResize(event.clientX);
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      debouncedResize.cancel();
    };
  }, [isDragging, handleResize]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleOpenAddLayerModal = () => {
    setOpenAddLayerModal(true);
  };

  const handleCloseAddLayerModal = () => {
    clearTempLayers();
    setOpenAddLayerModal(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <Drawer
        variant="persistent"
        open={isOpen}
        sx={{
          width: currentWidth,
          transition: "width 0.3s ease",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: currentWidth,
            boxSizing: "border-box",
            zIndex: 1000,
            backgroundColor: "#555555",
            color: "#ffffff",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
          },
        }}
      >
        <SidebarTopSection onOpenAddLayerModal={handleOpenAddLayerModal} />

        {/* Sidebar content area */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            position: "relative",
          }}
        >
          {/* Layer List - Lazy Loaded */}
          <Suspense fallback={<div>Loading Layers...</div>}>
            <Box
              sx={{
                overflowY: "auto",
                flexGrow: 1,
                maxHeight: "80vh",
              }}
            >
              <LayerList />
            </Box>
          </Suspense>
        </Box>

        {/* Upload Modal - Lazy Loaded */}
        <Suspense fallback={<div>Loading Modal...</div>}>
          <AddLayerModal
            open={openAddLayerModal}
            onClose={handleCloseAddLayerModal}
          />
        </Suspense>
      </Drawer>

      {!isOpen && (
        <div
          style={{
            position: "absolute",
            left: 24,
            top: 0,
            zIndex: 1300,
          }}
        >
          <img
            src={AppLogo}
            alt="App Logo"
            style={{ width: "170px", height: "70px" }}
          />
        </div>
      )}

      {isOpen && (
        <div
          style={{
            position: "absolute",
            left: currentWidth - 3,
            top: 0,
            height: "100%",
            width: "6px",
            cursor: "col-resize",
            backgroundColor: dragHandleVisible ? "#6A6A6A" : "transparent",
            transition: "background-color 0.3s ease",
            zIndex: 1100,
          }}
          onMouseDown={handleMouseDown}
          onMouseEnter={() => setDragHandleVisible(true)}
          onMouseLeave={() => setDragHandleVisible(false)}
        />
      )}

      {isOpen && (
        <IconButton
          onClick={onToggle}
          sx={{
            position: "absolute",
            left: currentWidth - 10,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1200,
            backgroundColor: "#555555",
            color: "white",
            width: 15,
            height: 40,
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: "#6A6A6A",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
            },
            borderRadius: "15%",
          }}
        >
          <ChevronLeft />
        </IconButton>
      )}

      {!isOpen && (
        <CustomIconButton
          onClick={onToggle}
          tooltipTitle="Map Layers"
          icon={
            <img
              src={MapLayerIcon}
              alt="Map Layers"
              style={{ width: "100%", height: "100%" }}
            />
          }
          borderRadius="20%"
          tooltipPlacement="right"
          left={15}
          top="50%"
          transform="translateY(-70%)"
          absolute
        />
      )}
    </div>
  );
};

export default Sidebar;
