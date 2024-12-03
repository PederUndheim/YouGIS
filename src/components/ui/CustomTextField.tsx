import React from "react";
import { TextField as MuiTextField, TextFieldProps } from "@mui/material";

type CustomTextFieldProps = TextFieldProps & {
  id?: string;
  label: string;
};

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  id,
  label,
  ...props
}) => {
  return (
    <MuiTextField
      id={id}
      fullWidth
      label={label}
      variant="standard"
      autoComplete="off"
      sx={{
        mb: 3,
        "& .MuiInput-root": {
          color: "#ffffff",
          backgroundColor: "#555555",
          "&:before": {
            borderBottomColor: "#ffffff",
          },
          "&:hover:not(.Mui-disabled):before": {
            borderBottomColor: "#A8D99C",
          },
          "&:after": {
            borderBottomColor: "#A8D99C",
          },
        },
        "& .MuiInputLabel-root": {
          color: "#A8D99C",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#A8D99C",
        },
      }}
      {...props} // Spread the rest of the props to the TextField
    />
  );
};

export default CustomTextField;
