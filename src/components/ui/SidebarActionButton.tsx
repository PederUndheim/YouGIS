import React from "react";
import { IconButton, Tooltip } from "@mui/material";

interface SidebarActionButtonProps {
  icon: React.ReactNode;
  tooltipTitle: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const SidebarActionButton: React.FC<SidebarActionButtonProps> = ({
  icon,
  tooltipTitle,
  onClick,
  disabled = false,
  id,
}) => {
  return (
    <Tooltip title={tooltipTitle} placement="top" arrow>
      <span>
        <IconButton
          id={id}
          onClick={disabled ? undefined : onClick}
          disabled={disabled}
          sx={{
            color: "white",
            opacity: disabled ? 0.7 : 1,
          }}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default SidebarActionButton;
