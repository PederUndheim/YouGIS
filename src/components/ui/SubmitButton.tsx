import React from "react";
import { Button, ButtonProps } from "@mui/material";

interface PrimaryButtonProps extends ButtonProps {
  id?: string;
  label: string;
  handleSubmit: () => void;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  id,
  label,
  handleSubmit,
  ...props
}) => {
  return (
    <Button
      id={id}
      variant="contained"
      onClick={handleSubmit}
      sx={{
        backgroundColor: "#A8D99C",
        color: "#000",
        "&:hover": {
          backgroundColor: "#89C287",
        },
      }}
      {...props}
    >
      {label}
    </Button>
  );
};

export default PrimaryButton;
