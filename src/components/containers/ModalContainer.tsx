import React, { useEffect } from "react";
import { Modal, Box, IconButton, Typography, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CancelButton from "../ui/CancelButton";
import SubmitButton from "../ui/SubmitButton";
import HelpIcon from "@mui/icons-material/Help";

interface ModalContainerProps {
  headerId?: string;
  open: boolean;
  onClose: () => void;
  header: string;
  submitLabel: string;
  children: React.ReactNode;
  onSubmit: () => void;
  disableSubmit?: boolean;
  modalWidth?: number;
  headermargin?: number;
  tutorialHelp?: boolean;
  openTutorial?: () => void;
  submitButtonProps?: React.ComponentProps<typeof SubmitButton>;
}

const ModalContainer: React.FC<ModalContainerProps> = ({
  headerId,
  open,
  onClose,
  header,
  submitLabel,
  children,
  onSubmit,
  disableSubmit = false,
  modalWidth,
  headermargin,
  tutorialHelp,
  openTutorial,
  submitButtonProps,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !disableSubmit) {
        event.preventDefault();
        onSubmit();
      }
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, disableSubmit, onSubmit]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#555555",
          color: "#ffffff",
          boxShadow: 24,
          p: 4,
          borderRadius: "8px",
          width: modalWidth ? modalWidth : 400,
          paddingTop: 3,
        }}
      >
        {/* Modal Header with Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "#ffffff",
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          id={headerId}
          variant="h6"
          sx={{ mb: headermargin ? headermargin : 3 }}
        >
          {header}
        </Typography>
        {/* Modal Content */}
        {children} {/* Dynamic content */}
        {/* Button Layout */}
        <Box
          mt={4}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          {tutorialHelp && (
            <Tooltip title="Tutorial steps" placement="right" arrow>
              <IconButton
                aria-label="help"
                color="inherit"
                onClick={openTutorial}
                sx={{ color: "white", fontSize: 25 }}
              >
                <HelpIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          )}
          <Box ml="auto" display="flex" alignItems="center">
            <CancelButton onClose={onClose} />{" "}
            <SubmitButton
              id="submit-button"
              label={submitLabel}
              handleSubmit={onSubmit}
              disabled={disableSubmit}
              {...submitButtonProps}
            />{" "}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalContainer;
