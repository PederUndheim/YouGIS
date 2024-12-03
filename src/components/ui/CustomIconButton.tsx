import React from "react";
import { IconButton, Tooltip } from "@mui/material";

interface CustomIconButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  tooltipTitle: string;
  icon: React.ReactNode;
  backgroundColor?: string;
  borderRadius?: string;
  tooltipPlacement?: "top" | "bottom" | "left" | "right";
  top?: string | number;
  bottom?: number;
  left?: number;
  right?: number;
  width?: number;
  height?: number;
  transform?: string;
  absolute?: boolean;
  id?: string;
}

const CustomIconButton: React.FC<CustomIconButtonProps> = ({
  onClick,
  tooltipTitle,
  icon,
  backgroundColor = "#A8D99C",
  borderRadius = "50%",
  tooltipPlacement = "right",
  top,
  bottom,
  left,
  right,
  width = 70,
  height = 70,
  transform,
  absolute = false,
  id,
}) => {
  return (
    <Tooltip title={tooltipTitle} placement={tooltipPlacement} arrow>
      <IconButton
        id={id}
        onClick={onClick}
        sx={{
          position: absolute ? "absolute" : "relative",
          top: top,
          bottom: bottom ? bottom : undefined,
          left: left ? left : undefined,
          right: right ? right : undefined,
          transform: transform,
          backgroundColor: backgroundColor,
          borderRadius: borderRadius,
          zIndex: 1100,
          width: width,
          height: height,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "transform 0.3s ease, width 0.3s ease, height 0.3s ease",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
          "&:hover": {
            width: `calc(${width}px * 1.08)`,
            height: `calc(${height}px * 1.08)`,
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.25)",
            transform: `${transform} scale(1.04)`,
            border: "1px solid #ccc",
          },
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default CustomIconButton;
