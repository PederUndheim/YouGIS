import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CustomSelectField from "../ui/CustomSelectField";
import CustomTextField from "../ui/CustomTextField";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

interface AttributeTableFilteringProps {
  attributes: { id: string; [key: string]: any }[];
  onFilterChange: (filteredData: { id: string; [key: string]: any }[]) => void;
}

const AttributeTableFiltering: React.FC<AttributeTableFilteringProps> = ({
  attributes,
  onFilterChange,
}) => {
  const [filterRules, setFilterRules] = useState([
    { selectedAttribute: null, selectedOperation: null, filterValue: "" },
  ]);

  const operationsByType: Record<string, string[]> = {
    string: ["equals", "starts with", "contains"],
    number: ["=", "!=", ">", "<", ">=", "<="],
    boolean: ["is true", "is false"],
  };

  const getAttributeType = (key: string): string | null => {
    const types = new Set<string>();

    for (const row of attributes) {
      const value = row[key];
      if (typeof value === "string") types.add("string");
      if (typeof value === "number") types.add("number");
      if (typeof value === "boolean") types.add("boolean");
    }
    if (types.size > 1) return "mixed";
    return types.size === 1 ? Array.from(types)[0] : null;
  };

  const handleApplyFilter = () => {
    const filteredData = attributes.filter((row) =>
      filterRules.every((rule) => {
        const { selectedAttribute, selectedOperation, filterValue } = rule;
        if (!selectedAttribute || !selectedOperation) return true;

        const rowValue = row[selectedAttribute as keyof typeof row];
        if (typeof rowValue === "string") {
          if (selectedOperation === "equals") return rowValue === filterValue;
          if (selectedOperation === "starts with")
            return rowValue.startsWith(filterValue);
          if (selectedOperation === "contains")
            return rowValue.includes(filterValue);
        } else if (typeof rowValue === "number") {
          const numValue = Number(filterValue);
          if (selectedOperation === "=") return rowValue === numValue;
          if (selectedOperation === "!=") return rowValue !== numValue;
          if (selectedOperation === ">") return rowValue > numValue;
          if (selectedOperation === "<") return rowValue < numValue;
          if (selectedOperation === ">=") return rowValue >= numValue;
          if (selectedOperation === "<=") return rowValue <= numValue;
        } else if (typeof rowValue === "boolean") {
          if (selectedOperation === "is true") return rowValue === true;
          if (selectedOperation === "is false") return rowValue === false;
        }
        return false;
      })
    );

    onFilterChange(filteredData);
  };

  const handleClearFilter = (index: number) => {
    setFilterRules((prevRules) => {
      if (index === 0) {
        // Reset the inputs for the first row without removing it
        const updatedRules = prevRules.map((rule, i) =>
          i === 0
            ? {
                selectedAttribute: null,
                selectedOperation: null,
                filterValue: "",
              }
            : rule
        );

        // Reapply the filtering logic with the updated rules
        const filteredData = attributes.filter((row) =>
          updatedRules.every((rule) => {
            const { selectedAttribute, selectedOperation, filterValue } = rule;
            if (!selectedAttribute || !selectedOperation) return true;

            const rowValue = row[selectedAttribute as keyof typeof row];
            if (typeof rowValue === "string") {
              if (selectedOperation === "equals")
                return rowValue === filterValue;
              if (selectedOperation === "starts with")
                return rowValue.startsWith(filterValue);
              if (selectedOperation === "contains")
                return rowValue.includes(filterValue);
            } else if (typeof rowValue === "number") {
              const numValue = Number(filterValue);
              if (selectedOperation === "=") return rowValue === numValue;
              if (selectedOperation === "!=") return rowValue !== numValue;
              if (selectedOperation === ">") return rowValue > numValue;
              if (selectedOperation === "<") return rowValue < numValue;
              if (selectedOperation === ">=") return rowValue >= numValue;
              if (selectedOperation === "<=") return rowValue <= numValue;
            } else if (typeof rowValue === "boolean") {
              if (selectedOperation === "is true") return rowValue === true;
              if (selectedOperation === "is false") return rowValue === false;
            }
            return false;
          })
        );

        onFilterChange(filteredData); // Update the table with the new filtered data
        return updatedRules;
      } else {
        // Remove the rule for other rows
        const updatedRules = prevRules.filter((_, i) => i !== index);

        // Reapply the filtering logic with the updated rules
        const filteredData = attributes.filter((row) =>
          updatedRules.every((rule) => {
            const { selectedAttribute, selectedOperation, filterValue } = rule;
            if (!selectedAttribute || !selectedOperation) return true;

            const rowValue = row[selectedAttribute as keyof typeof row];
            if (typeof rowValue === "string") {
              if (selectedOperation === "equals")
                return rowValue === filterValue;
              if (selectedOperation === "starts with")
                return rowValue.startsWith(filterValue);
              if (selectedOperation === "contains")
                return rowValue.includes(filterValue);
            } else if (typeof rowValue === "number") {
              const numValue = Number(filterValue);
              if (selectedOperation === "=") return rowValue === numValue;
              if (selectedOperation === "!=") return rowValue !== numValue;
              if (selectedOperation === ">") return rowValue > numValue;
              if (selectedOperation === "<") return rowValue < numValue;
              if (selectedOperation === ">=") return rowValue >= numValue;
              if (selectedOperation === "<=") return rowValue <= numValue;
            } else if (typeof rowValue === "boolean") {
              if (selectedOperation === "is true") return rowValue === true;
              if (selectedOperation === "is false") return rowValue === false;
            }
            return false;
          })
        );

        onFilterChange(filteredData); // Update the table with the new filtered data
        return updatedRules;
      }
    });
  };

  const handleAddFilterRule = () => {
    setFilterRules((prevRules) => [
      ...prevRules,
      { selectedAttribute: null, selectedOperation: null, filterValue: "" },
    ]);
  };

  const handleUpdateRule = (
    index: number,
    field: "selectedAttribute" | "selectedOperation" | "filterValue",
    value: string
  ) => {
    setFilterRules((prevRules) =>
      prevRules.map((rule, i) =>
        i === index ? { ...rule, [field]: value } : rule
      )
    );
  };

  return (
    <Box sx={{ p: 2, pt: 1 }}>
      {filterRules.map((rule, index) => {
        const attributeType = rule.selectedAttribute
          ? getAttributeType(rule.selectedAttribute)
          : null;

        return (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              width: "100%",
            }}
          >
            {/* Fields and Icon Buttons */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flex: 3,
              }}
            >
              <CustomSelectField
                id="attribute-select"
                label="Attribute"
                value={rule.selectedAttribute || ""}
                options={Object.keys(attributes[0] || {}).map((attr) => ({
                  value: attr,
                  label: attr,
                }))}
                onChange={(e) =>
                  handleUpdateRule(
                    index,
                    "selectedAttribute",
                    e.target.value as string
                  )
                }
              />
              <CustomSelectField
                id="operation-select"
                label="Operation"
                value={rule.selectedOperation || ""}
                options={
                  attributeType
                    ? operationsByType[attributeType]?.map((op) => ({
                        value: op,
                        label: op,
                      }))
                    : []
                }
                onChange={(e) =>
                  handleUpdateRule(
                    index,
                    "selectedOperation",
                    e.target.value as string
                  )
                }
                disabled={!attributeType}
              />
              <CustomTextField
                id="filter-value"
                label="Value"
                value={rule.filterValue}
                onChange={(e) =>
                  handleUpdateRule(index, "filterValue", e.target.value)
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <IconButton
                  id="apply-filter"
                  onClick={handleApplyFilter}
                  disabled={
                    !filterRules.some(
                      (rule) => rule.selectedAttribute && rule.selectedOperation
                    )
                  }
                  sx={{
                    color: "#A8D99C",
                    "&.Mui-disabled": {
                      color: "rgba(168, 217, 156, 0.5)",
                    },
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 24 }} />
                </IconButton>
                <IconButton
                  onClick={() => {
                    handleClearFilter(index);
                  }}
                  sx={{
                    color: "#ECAC7A",
                  }}
                >
                  <CancelIcon sx={{ fontSize: 24 }} />
                </IconButton>
              </Box>
            </Box>

            {/* Add Another Rule Button */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent:
                  index === filterRules.length - 1 ? "center" : "flex-start",
              }}
            >
              {index === filterRules.length - 1 && (
                <Button
                  variant="outlined"
                  onClick={handleAddFilterRule}
                  sx={{
                    borderColor: "#A8D99C",
                    fontSize: "0.7rem",
                    color: "#A8D99C",
                    whiteSpace: "nowrap",
                    px: 2,
                    "&:hover": {
                      backgroundColor: "rgba(168, 217, 156, 0.1)",
                    },
                  }}
                >
                  Add another rule
                </Button>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default AttributeTableFiltering;
