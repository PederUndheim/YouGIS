import React from "react";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectProps,
  SelectChangeEvent,
} from "@mui/material";

interface CustomSelectFieldProps
  extends Omit<SelectProps, "onChange" | "value"> {
  id?: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (event: SelectChangeEvent<unknown>, child: React.ReactNode) => void;
  error?: boolean;
  helperText?: string;
}

const CustomSelectField: React.FC<CustomSelectFieldProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  ...props
}) => {
  return (
    <FormControl fullWidth variant="standard" sx={{ mb: 3 }} error={error}>
      <InputLabel
        shrink
        sx={{
          color: "#A8D99C",
          "&.Mui-focused": {
            color: "#A8D99C",
          },
        }}
      >
        {label}
      </InputLabel>
      <Select
        id={id}
        value={value}
        onChange={onChange}
        MenuProps={{
          PaperProps: {
            sx: {
              bgcolor: "#555555",
              color: "#ffffff",
              "& .MuiMenuItem-root": {
                // Style for menu items
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                },
                "&.Mui-selected": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                },
                "&.Mui-selected:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                },
              },
            },
          },
        }}
        sx={{
          bgcolor: "#555555",
          color: "#ffffff !important",
          "&:before": {
            borderBottomColor: "#ffffff",
          },
          "&:hover:not(.Mui-disabled):before": {
            borderBottomColor: "#A8D99C",
          },
          "&:after": {
            borderBottomColor: "#A8D99C",
          },
          "& .MuiSelect-icon": {
            color: "#A8D99C",
          },
          "& .Mui-selected": {
            bgcolor: "#A8D99C !important",
            color: "black !important",
          },
        }}
        {...props}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{ color: "#ffffff" }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <div style={{ color: "#d32f2f", marginTop: "4px", fontSize: "12px" }}>
          {helperText}
        </div>
      )}{" "}
      {/* Display helper text */}
    </FormControl>
  );
};

export default CustomSelectField;
