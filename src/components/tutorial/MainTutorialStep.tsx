import React, { useEffect } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material";

interface MainTutorialStepProps {
  header: string;
  content: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onCancel: () => void;
  onQuit: () => void;
  disableNext?: boolean;
  disablePrev?: boolean;
  themeColors: {
    overlayColor: string;
    textColor: string;
    backgroundColor: string;
    buttonColor: string;
  };
}

const MainTutorialStep: React.FC<MainTutorialStepProps> = ({
  header,
  content,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onCancel,
  onQuit,
  disableNext = false,
  disablePrev = false,
  themeColors,
}) => {
  const theme = useTheme();

  // Handle Arrow Key Navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && !disablePrev) {
        onPrev();
      } else if (event.key === "ArrowRight" && !disableNext) {
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onPrev, onNext, disablePrev, disableNext]);

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: themeColors.backgroundColor,
        color: themeColors.textColor,
        boxShadow: 24,
        p: 4,
        borderRadius: "8px",
        width: 400,
        zIndex: 2000, // Ensure it appears above the overlay
        textAlign: "center",
      }}
    >
      {/* Cancel Button */}
      <IconButton
        onClick={onCancel}
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          color: themeColors.textColor,
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Header */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        {header}
      </Typography>

      {/* Content */}

      <Box
        sx={{
          mb: 3,
          ...theme.typography.body2,
          color: themeColors.textColor,
          maxHeight: "78vh",
          overflowY: "auto",
        }}
      >
        {content}
      </Box>

      {/* Navigation Buttons with Step Counter */}
      <Box
        display="flex"
        justifyContent="space-around"
        alignItems="center"
        px="10px"
      >
        {/* Back Button */}
        <Button
          variant="outlined"
          onClick={onPrev}
          disabled={disablePrev}
          sx={{
            borderColor: "#ECAC7A",
            color: "#ECAC7A",
            mr: 2,
            "&:hover": {
              backgroundColor: "rgba(236, 172, 122, 0.1)",
              borderColor: "#E59548",
            },
          }}
        >
          Back
        </Button>
        {/* Step Counter */}
        <Typography
          variant="body1"
          sx={{
            color: themeColors.textColor,
            fontWeight: "bold",
            mx: 2,
          }}
        >
          {`${currentStep} / ${totalSteps}`}
        </Typography>

        {/* Next or Finish Button */}
        <Button
          variant="contained"
          onClick={disableNext ? onQuit : onNext}
          sx={{
            backgroundColor: "#A8D99C",
            color: "#000",
            "&:hover": {
              backgroundColor: "#89C287",
            },
          }}
        >
          {disableNext ? "Finish" : "Next"}
        </Button>
      </Box>
    </Box>
  );
};

export default MainTutorialStep;
