import React from "react";
import { Box } from "@mui/material";
import TutorialStep from "./MainTutorialStep";

interface TutorialStepProps {
  header: string;
  content: React.ReactNode;
}

interface MainTutorialProps {
  steps: TutorialStepProps[];
  run: boolean;
  currentStep: number;
  setRun: (run: boolean) => void;
  setPaused: (paused: boolean) => void;
  setCurrentStep: (step: number) => void;
  themeColors: {
    overlayColor: string;
    textColor: string;
    backgroundColor: string;
    buttonColor: string;
  };
}

const MainTutorial: React.FC<MainTutorialProps> = ({
  steps,
  run,
  currentStep,
  setRun,
  setPaused,
  setCurrentStep,
  themeColors,
}) => {
  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handlePause = () => {
    setPaused(true);
    setRun(false);
  };

  const handleQuit = () => {
    setCurrentStep(0);
    setRun(false);
  };

  if (!run) return null;

  return (
    <>
      {/* Full-Screen Dim Overlay */}
      <Box
        onClick={handlePause} // Pause when clicking outside
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: themeColors.overlayColor,
          zIndex: 1500,
        }}
      />

      {/* Tutorial Step Tooltip (Centered Modal) */}
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2000,
        }}
      >
        <TutorialStep
          header={steps[currentStep]?.header}
          content={steps[currentStep]?.content}
          currentStep={currentStep + 1}
          totalSteps={steps.length}
          onNext={handleNext}
          onPrev={handlePrev}
          onCancel={handlePause}
          onQuit={handleQuit}
          disableNext={currentStep === steps.length - 1}
          disablePrev={currentStep === 0}
          themeColors={themeColors}
        />
      </Box>
    </>
  );
};

export default MainTutorial;
