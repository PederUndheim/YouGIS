import React, { useState } from "react";
import { Box, SpeedDial, SpeedDialAction, Backdrop } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PauseIcon from "@mui/icons-material/Pause";
import SchoolIcon from "@mui/icons-material/School";
import CustomIconButton from "../ui/CustomIconButton";
import MapIcon from "@mui/icons-material/Map";
import EditMapStyleModal from "../modals/EditMapStyleModal";
import AppTutorial from "../tutorial/MainTutorial";
import "../../styles/tooltip.css";
import { stepContent } from "../tutorial/StepContent";

const UserButtonsContainer: React.FC = () => {
  const [isEditMapStyleModalOpen, setIsEditMapStyleModalOpen] = useState(false);
  const [isTutorialRunning, setIsTutorialRunning] = useState(false);
  const [isTutorialPaused, setIsTutorialPaused] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const openEditMapStyleModal = () => setIsEditMapStyleModalOpen(true);
  const closeEditMapStyleModal = () => setIsEditMapStyleModalOpen(false);

  const handleStartTutorial = () => {
    setIsTutorialPaused(false);
    setIsTutorialRunning(true);
    setSpeedDialOpen(false);
  };

  const handleResumeTutorial = () => {
    setIsTutorialPaused(false);
    setIsTutorialRunning(true);
    setSpeedDialOpen(false);
  };

  const handlePauseTutorial = () => {
    setIsTutorialPaused(true);
    setIsTutorialRunning(false);
    setSpeedDialOpen(false);
  };

  const handleResetTutorial = () => {
    setIsTutorialPaused(false);
    setIsTutorialRunning(true);
    setCurrentStep(0);
    setSpeedDialOpen(false);
  };

  const handleQuitTutorial = () => {
    setIsTutorialPaused(false);
    setIsTutorialRunning(false);
    setSpeedDialOpen(false);
  };

  const actions = isTutorialPaused
    ? [
        {
          icon: <PlayArrowIcon />,
          name: "Resume Tutorial",
          onClick: handleResumeTutorial,
        },
        {
          icon: <RestartAltIcon />,
          name: "Reset Tutorial",
          onClick: handleResetTutorial,
        },
        {
          icon: <ExitToAppIcon />,
          name: "Quit Tutorial",
          onClick: handleQuitTutorial,
        },
      ]
    : isTutorialRunning
    ? [
        {
          icon: <PauseIcon />,
          name: "Pause Tutorial",
          onClick: handlePauseTutorial,
        },
        {
          icon: <RestartAltIcon />,
          name: "Reset Tutorial",
          onClick: handleResetTutorial,
        },
        {
          icon: <ExitToAppIcon />,
          name: "Quit Tutorial",
          onClick: handleQuitTutorial,
        },
      ]
    : [
        {
          icon: <PlayArrowIcon />,
          name: "Start Tutorial",
          onClick: handleStartTutorial,
        },
      ];

  return (
    <Box
      sx={{
        position: "absolute",
        top: 4,
        right: 0,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Box sx={{ pt: 1.2 }}>
        <CustomIconButton
          onClick={openEditMapStyleModal}
          tooltipTitle="Change Map Style"
          tooltipPlacement="left"
          width={50}
          height={50}
          backgroundColor="#555555"
          icon={
            <MapIcon
              sx={{
                color: "white",
                fontSize: "1.8rem",
                transition: "color 0.3s ease",
                "&:hover": {
                  color: "white",
                },
              }}
            />
          }
        />
      </Box>

      <EditMapStyleModal
        open={isEditMapStyleModalOpen}
        onClose={closeEditMapStyleModal}
      />

      <Box sx={{ position: "relative", display: "flex", ml: 2 }}>
        <Backdrop
          open={speedDialOpen}
          sx={{ zIndex: 10, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        />
        <SpeedDial
          ariaLabel="Tutorial"
          icon={
            <SchoolIcon
              sx={{
                color: "#555555",
                fontSize: "2.8rem",
                transition: "color 0.3s ease",
              }}
            />
          }
          onClose={() => setSpeedDialOpen(false)}
          onOpen={() => setSpeedDialOpen(true)}
          open={speedDialOpen}
          direction="down"
          sx={{
            position: "relative",
            ".MuiSpeedDial-fab": {
              backgroundColor: "#ECAC7A", // Default background color
              borderRadius: "50%", // Fully rounded button
              width: "70px", // Match size with CustomIconButton
              height: "70px", // Match size with CustomIconButton
              color: "#ECAC7A", // Default icon color
              "&:hover": {
                backgroundColor: "transparent", // Transparent effect on hover
                transform: "scale(1.08)", // Slightly enlarge
                border: "1px solid #ccc", // Thin border on hover
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.25)", // Stronger shadow
              },
            },
          }}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
              tooltipOpen
              FabProps={{
                sx: {
                  mr: 1.1,
                  mb: 0.7,
                  mt: 0.5,
                  color: "#555555", // Icon color
                  borderRadius: "50%", // Fully rounded
                  width: "40px", // Custom button width
                  height: "40px", // Custom button height
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)", // Hover background color
                    color: "#ffffff", // Hover icon color
                    transform: "scale(1.1)", // Slightly enlarge on hover
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)", // Stronger shadow on hover
                  },
                },
              }}
            />
          ))}
        </SpeedDial>
      </Box>

      <AppTutorial
        steps={stepContent}
        run={isTutorialRunning}
        currentStep={currentStep}
        setRun={setIsTutorialRunning}
        setCurrentStep={setCurrentStep}
        setPaused={setIsTutorialPaused}
        themeColors={{
          overlayColor: "rgba(0, 0, 0, 0.4)",
          textColor: "white",
          backgroundColor: "#555555",
          buttonColor: "#ECAC7A",
        }}
      />
    </Box>
  );
};

export default UserButtonsContainer;
