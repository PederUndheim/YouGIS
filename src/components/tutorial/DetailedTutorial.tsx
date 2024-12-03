import React from "react";
import ReactJoyride, { CallBackProps, Step } from "react-joyride";

interface DetailedTutorialProps {
  steps: Step[];
  run: boolean;
  onClose: () => void;
  continuous?: boolean;
  showSkipButton?: boolean;
  showProgress?: boolean;
}

const DetailedTutorial: React.FC<DetailedTutorialProps> = ({
  steps,
  run,
  onClose,
  continuous = true,
  showSkipButton = false,
  showProgress = true,
}) => {
  const handleCallback = (data: CallBackProps) => {
    const { status, action } = data;

    // Quit the tutorial when the close button is clicked
    if (status === "skipped" || action === "close") {
      onClose();
    }

    // End the tutorial when it finishes
    if (status === "finished") {
      onClose();
    }
  };
  return (
    <ReactJoyride
      steps={steps}
      run={run}
      callback={handleCallback}
      continuous={continuous}
      showSkipButton={showSkipButton}
      showProgress={showProgress}
      scrollToFirstStep={false}
      disableScrolling
      styles={{
        options: {
          arrowColor: "#555555",
          backgroundColor: "#555555",
          overlayColor: "rgba(0, 0, 0, 0.5)",
          primaryColor: "#A8D99C",
          textColor: "white",
          zIndex: 2000,
        },
        buttonBack: {
          backgroundColor: "#ECAC7A",
          color: "#000",
          borderRadius: "4px",
          padding: "8px 16px",
          fontSize: "14px",
        },
        buttonNext: {
          backgroundColor: "#A8D99C",
          color: "#000",
          borderRadius: "4px",
          padding: "8px 16px",
          fontSize: "14px",
        },
        buttonClose: {
          backgroundColor: "transparent",
          color: "#ffffff",
          fontSize: "14px",
        },
        buttonSkip: {
          backgroundColor: "#FF6F61",
          color: "#ffffff",
          borderRadius: "4px",
          padding: "8px 16px",
        },
        tooltipContent: {
          color: "#FFFFFF",
          fontSize: "15px",
        },
      }}
    />
  );
};

export default DetailedTutorial;
