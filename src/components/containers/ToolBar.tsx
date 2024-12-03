import { useState } from "react";
import { IconButton, Box, styled } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import CustomIconButton from "../ui/CustomIconButton";
import BufferTool from "../tools/BufferTool";
import IntersectTool from "../tools/IntersectTool";
import UnionTool from "../tools/UnionTool";
import DifferenceTool from "../tools/DifferenceTool";
import DissolveTool from "../tools/DissolveTool";
import BoundingBoxTool from "../tools/BoundingBoxTool";
import ClipTool from "../tools/ClipTool";
import VoronoiTool from "../tools/VoronoiTool";
import TinTool from "../tools/TinTool";

// Import SVGs as image sources
import ToolIcon from "../../assets/ToolIcon.svg";
import BufferIcon from "../../assets/tools/BufferIcon.svg";
import IntersectIcon from "../../assets/tools/IntersectIcon.svg";
import UnionIcon from "../../assets/tools/UnionIcon.svg";
import DifferenceIcon from "../../assets/tools/DifferenceIcon.svg";
import DissolveIcon from "../../assets/tools/DissolveIcon.svg";
import VoronoiIcon from "../../assets/tools/VoronoiIcon.svg";
import BoundingBoxIcon from "../../assets/tools/BoundingBoxIcon.svg";

import React from "react";
import { intersect } from "@turf/turf";
import { union } from "@turf/turf";
import { difference } from "@turf/turf";

// Styled container for the toolbar
const ToolbarContainer = styled(Box)(() => ({
  position: "fixed",
  right: 10,
  top: "55%",
  background: "rgba(255, 255, 255, 0.5)",
  boxShadow: "0 0 5px rgba(0,0,0,0.5)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  transform: "translateY(-50%)",
  transition: "width 0.3s ease-in-out",
  zIndex: 1000,
  borderRadius: "20px",
  gap: "8px",
  paddingTop: "10px",
  paddingBottom: "10px",
}));

// Styled wrapper for icon visibility
const IconWrapper = styled(Box)<{ isOpen: boolean }>(({ isOpen }) => ({
  opacity: isOpen ? 1 : 0,
  transition: "opacity 0.5s ease",
}));

// Styled wrapper for tools icon visibility
const ToolsIconWrapper = styled(Box)<{ isOpen: boolean }>(({ isOpen }) => ({
  opacity: isOpen ? 1 : 0,
  transition: "opacity 2.0s ease",
}));

// Individual Icon Component
const ToolbarIcon: React.FC<{
  src?: string;
  icon?: React.ReactNode;
  tooltip: string;
  isOpen: boolean;
  onClick: () => void;
}> = ({ src, icon, tooltip, isOpen, onClick }) => (
  <IconWrapper isOpen={isOpen}>
    <CustomIconButton
      onClick={onClick}
      tooltipTitle={tooltip}
      icon={
        src ? (
          <img
            src={src}
            alt={tooltip}
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          icon
        )
      }
      tooltipPlacement="right"
      width={50}
      height={50}
    />
  </IconWrapper>
);

// Toolbar component definition
const Toolbar: React.FC<{
  isOpen: boolean;
  onToggle: () => void;
}> = ({ isOpen, onToggle }) => {
  const [isBufferToolOpen, setBufferToolOpen] = useState(false);
  const [isIntersectToolOpen, setIntersectToolOpen] = useState(false);
  const [isUnionToolOpen, setUnionToolOpen] = useState(false);
  const [isDifferenceToolOpen, setDifferenceToolOpen] = useState(false);
  const [isDissolveToolOpen, setDissolveToolOpen] = useState(false);
  const [isBoundingBoxToolOpen, setBoundingBoxToolOpen] = useState(false);
  const [isClipToolOpen, setClipToolOpen] = useState(false);
  const [isVoronoiToolOpen, setVoronoiToolOpen] = useState(false);
  const [isTinToolOpen, setTinToolOpen] = useState(false);

  return (
    <>
      <ToolbarContainer sx={{ width: isOpen ? 75 : 0 }}>
        {/* Individual Icon Components */}
        <ToolbarIcon
          src={BufferIcon}
          tooltip="Buffer"
          isOpen={isOpen}
          onClick={() => setBufferToolOpen(true)}
        />
        <ToolbarIcon
          src={IntersectIcon}
          tooltip="Intersect"
          isOpen={isOpen}
          onClick={() => setIntersectToolOpen(true)}
        />
        <ToolbarIcon
          src={UnionIcon}
          tooltip="Union"
          isOpen={isOpen}
          onClick={() => setUnionToolOpen(true)}
        />
        <ToolbarIcon
          src={DifferenceIcon}
          tooltip="Difference"
          isOpen={isOpen}
          onClick={() => setDifferenceToolOpen(true)}
        />
        <ToolbarIcon
          src={DissolveIcon}
          tooltip="Dissolve"
          isOpen={isOpen}
          onClick={() => setDissolveToolOpen(true)}
        />
        <ToolbarIcon
          src={VoronoiIcon}
          tooltip="Voronoi"
          isOpen={isOpen}
          onClick={() => setVoronoiToolOpen(true)}
        />
        <ToolbarIcon
          icon={
            <ChangeHistoryIcon
              sx={{ color: "black", width: 40, height: 40, mt: -0.5 }}
            />
          }
          tooltip="TIN"
          isOpen={isOpen}
          onClick={() => setTinToolOpen(true)}
        />
        <ToolbarIcon
          src={BoundingBoxIcon}
          tooltip="Bounding Box"
          isOpen={isOpen}
          onClick={() => setBoundingBoxToolOpen(true)}
        />
        <ToolbarIcon
          icon={
            <ContentCutIcon sx={{ color: "black", width: 24, height: 24 }} />
          }
          tooltip="Clip"
          isOpen={isOpen}
          onClick={() => setClipToolOpen(true)}
        />

        {/* Close Toolbar Button */}
        <IconWrapper isOpen={isOpen}>
          <IconButton onClick={onToggle} sx={{ marginTop: "auto" }}>
            <ArrowForward />
          </IconButton>
        </IconWrapper>
      </ToolbarContainer>

      {/* Button to Open the Toolbar */}
      {!isOpen && (
        <ToolsIconWrapper isOpen={!isOpen}>
          <CustomIconButton
            onClick={onToggle}
            tooltipTitle="GIS Tools"
            icon={
              <img
                src={ToolIcon}
                alt="GIS Tools"
                style={{ width: "80%", height: "80%" }}
              />
            }
            tooltipPlacement="right"
            top="50%"
            right={15}
            transform="translateY(-70%)"
            absolute
          />
        </ToolsIconWrapper>
      )}

      {/* Buffer Tool Modal */}
      {isBufferToolOpen && (
        <BufferTool
          open={isBufferToolOpen}
          onClose={() => setBufferToolOpen(false)}
        />
      )}

      {/* Intersect Tool Modal */}
      {isIntersectToolOpen && (
        <IntersectTool
          open={isIntersectToolOpen}
          onClose={() => setIntersectToolOpen(false)}
          operationLabel="Intersection"
          turfFunction={intersect}
        />
      )}

      {/* Union Tool Modal */}
      {isUnionToolOpen && (
        <UnionTool
          open={isUnionToolOpen}
          onClose={() => setUnionToolOpen(false)}
          operationLabel="Union"
          turfFunction={union}
        />
      )}

      {/* Difference Tool Modal */}
      {isDifferenceToolOpen && (
        <DifferenceTool
          open={isDifferenceToolOpen}
          onClose={() => setDifferenceToolOpen(false)}
          operationLabel="Difference"
          turfFunction={difference}
        />
      )}

      {/* Dissolve Tool Modal */}
      {isDissolveToolOpen && (
        <DissolveTool
          open={isDissolveToolOpen}
          onClose={() => setDissolveToolOpen(false)}
        />
      )}

      {/* Bounding Box Tool Modal */}
      {isBoundingBoxToolOpen && (
        <BoundingBoxTool
          open={isBoundingBoxToolOpen}
          onClose={() => setBoundingBoxToolOpen(false)}
        />
      )}

      {/* Clip Tool Modal */}
      {isClipToolOpen && (
        <ClipTool
          open={isClipToolOpen}
          onClose={() => setClipToolOpen(false)}
        />
      )}

      {/* Voronoi Tool Modal */}
      {isVoronoiToolOpen && (
        <VoronoiTool
          open={isVoronoiToolOpen}
          onClose={() => setVoronoiToolOpen(false)}
        />
      )}

      {/* Point Cluster Tool Modal */}
      {isTinToolOpen && (
        <TinTool open={isTinToolOpen} onClose={() => setTinToolOpen(false)} />
      )}
    </>
  );
};

export default Toolbar;
