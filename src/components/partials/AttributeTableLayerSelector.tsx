import React from "react";
import { Box, Button } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import CustomSelectField from "../ui/CustomSelectField";
import { GeoJSONLayer } from "../../types";

interface AttributeTableLayerSelectorProps {
  layers: GeoJSONLayer[];
  selectedLayerId: string | null;
  setSelectedLayerId: React.Dispatch<React.SetStateAction<string | null>>;
  toggleFilterRow: () => void;
  isFilterRowVisible: boolean;
}

const AttributeTableLayerSelector: React.FC<
  AttributeTableLayerSelectorProps
> = ({
  layers,
  selectedLayerId,
  setSelectedLayerId,
  toggleFilterRow,
  isFilterRowVisible,
}) => (
  <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
    <Box
      sx={{
        flex: 2,
        alignItems: "center",
      }}
    >
      <CustomSelectField
        id="layer-select"
        label="Select layer to view attributes"
        value={selectedLayerId || ""}
        options={layers.map((layer) => ({
          value: layer.id,
          label: layer.name,
        }))}
        onChange={(e) => setSelectedLayerId((e.target.value as string) || null)}
      />
    </Box>
    <Box
      sx={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        mb: 2,
      }}
    >
      <Button
        id={"filter-button"}
        variant={isFilterRowVisible ? "outlined" : "contained"}
        startIcon={isFilterRowVisible ? <CloseIcon /> : <FilterAltIcon />}
        onClick={toggleFilterRow}
        sx={{
          backgroundColor: isFilterRowVisible ? undefined : "#A8D99C",
          color: isFilterRowVisible ? "#ECAC7A" : "#000",
          borderColor: isFilterRowVisible ? "#ECAC7A" : undefined,
          "&:hover": {
            backgroundColor: isFilterRowVisible
              ? "rgba(236, 172, 122, 0.1)"
              : "#89C287",
            borderColor: isFilterRowVisible ? "#E59548" : undefined,
          },
        }}
      >
        {isFilterRowVisible ? "Close Filtering" : "Filter on Attributes"}
      </Button>
    </Box>
  </Box>
);

export default AttributeTableLayerSelector;
