import React from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";

interface AttributeTableGridProps {
  id?: string;
  selectedLayerId: string | null;
  data: { [key: string]: any }[];
  onFilterModelChange?: (filterModel: any) => void;
  rowSelectionModel: GridRowSelectionModel;
  setRowSelectionModel: (model: GridRowSelectionModel) => void;
}

const AttributeTableGrid: React.FC<AttributeTableGridProps> = ({
  id,
  selectedLayerId,
  data,
  onFilterModelChange,
  rowSelectionModel,
  setRowSelectionModel,
}) => {
  // Validate the data
  const isValidData = data.every((row) => row.id);

  // Define columns based on data
  const columns: GridColDef[] =
    data.length > 0
      ? Object.keys(data[0]).map((key) => ({
          field: key,
          headerName: key,
          flex: 1,
          sortable: true,
          filterable: true,
          headerClassName: "super-app-theme--header",
        }))
      : [];

  return (
    <Box
      id={id}
      sx={{
        height: 500,
        bgcolor: "#444444",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {!selectedLayerId ? (
        <Typography
          variant="body2"
          sx={{ color: "#ffffff", textAlign: "center", mt: 4 }}
        >
          Please select a layer to view its attributes.
        </Typography>
      ) : isValidData ? (
        <DataGrid
          rows={data}
          columns={columns}
          checkboxSelection
          onRowSelectionModelChange={(newModel) =>
            setRowSelectionModel(newModel)
          } // Handle selection
          rowSelectionModel={rowSelectionModel}
          getRowId={(row) => row.id}
          onFilterModelChange={onFilterModelChange}
          sx={{
            // General Table Styling
            color: "white",
            bgcolor: "#555555",
            border: "none",
            borderRadius: "5px",

            // Custom header styling via class
            "& .super-app-theme--header": {
              backgroundColor: "#ECAC7A",
              color: "black",
              fontSize: "0.9rem",
              fontWeight: "bold",
            },

            // Styling for table cells
            "& .MuiDataGrid-cell": {
              color: "white",
              fontSize: "0.875rem",
              fontWeight: 400,
            },

            // Styling for header cells
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "#A8D99C",
              color: "black",
              fontSize: "1rem",
              fontWeight: "bold",
            },

            // Styling for header cell focus and active states
            "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
              {
                outline: "none",
              },

            // Styling for sort icons
            "& .MuiDataGrid-columnHeader .MuiDataGrid-sortIcon": {
              color: "black",
            },

            // Styling for rows (hover and selection effects)
            "& .MuiDataGrid-row:hover": {
              bgcolor: "rgba(255, 255, 255, 0.1)",
            },
            "& .Mui-selected": {
              bgcolor: "rgba(255, 255, 255, 0.1) !important",
              color: "white !important",
            },

            // Styling for footer (pagination controls)
            "& .MuiDataGrid-footerContainer": {
              bgcolor: "#666666",
              color: "white",
            },

            "& .MuiDataGrid-columnHeaderCheckbox": {
              backgroundColor: "#ECAC7A",
              color: "black",
            },

            // Styling for checkbox
            "& .MuiDataGrid-checkboxInput": {
              color: "#ECAC7A",
              outline: "none",
              "&.Mui-checked": {
                color: "#ECAC7A",
                outline: "none",
              },
            },

            "& .MuiDataGrid-columnHeaderCheckbox .MuiSvgIcon-root": {
              color: "white",
            },

            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-row.Mui-selected:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-row": {
              borderBottomWidth: "0.2px",
              borderBottomColor: "#ECAC7A",
            },
            "& .MuiDataGrid-columnSeparator": {
              color: "#white",
              "&hover": {
                color: "#ECAC7A",
              },
            },

            // Styling for scrollbar
            "& .MuiDataGrid-virtualScroller": {
              "&::-webkit-scrollbar": {
                width: "8px",
                height: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#A8D99C",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#ECAC7A",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#444444",
              },
            },
          }}
        />
      ) : (
        <Typography
          variant="body2"
          sx={{ color: "#ffffff", textAlign: "center", mt: 4 }}
        >
          Invalid data. Unable to display table.
        </Typography>
      )}
    </Box>
  );
};

export default AttributeTableGrid;
