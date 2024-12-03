// StyledButton.tsx

import React from "react";
import { Button, ButtonProps } from "@mui/material";

interface StyledButtonProps extends ButtonProps {
  onClose: () => void;
}

const StyledButton: React.FC<StyledButtonProps> = ({ onClose, ...props }) => {
  return (
    <Button
      variant="outlined"
      onClick={onClose}
      sx={{
        borderColor: "#ECAC7A",
        color: "#ECAC7A",
        mr: 2,
        "&:hover": {
          backgroundColor: "rgba(236, 172, 122, 0.1)",
          borderColor: "#E59548",
        },
      }}
      {...props}
    >
      Cancel
    </Button>
  );
};

export default StyledButton;
