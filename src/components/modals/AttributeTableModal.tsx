import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import ModalContainer from "../containers/ModalContainer";
import AttributeTableLayerSelector from "../partials/AttributeTableLayerSelector";
import AttributeTableGrid from "../partials/AttributeTableGrid";
import AttributeTableFiltering from "../partials/AttributeTableFiltering";
import { GeoJSONLayer } from "../../types";
import {
  FeatureCollection,
  Geometry,
  GeoJsonProperties,
  Feature,
} from "geojson";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { useLayerActionContext } from "../../context/LayerContext";
import { getRandomColor } from "../../utils/colorUtils";
import { Step } from "react-joyride";
import TutorialDetails from "../tutorial/DetailedTutorial";

interface AttributeTableModalProps {
  open: boolean;
  onClose: () => void;
  layers: GeoJSONLayer[];
  initialSelectedLayerId: string | null;
}

interface ExtendedFeature extends Feature<Geometry, GeoJsonProperties> {
  id: string; // Ensure id is always defined
}

const AttributeTableModal: React.FC<AttributeTableModalProps> = ({
  open,
  onClose,
  layers,
  initialSelectedLayerId,
}) => {
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(
    initialSelectedLayerId
  );
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);
  const { enqueueSnackbar } = useSnackbar();
  const { addLayer } = useLayerActionContext();
  const [isFilterRowVisible, setIsFilterRowVisible] = useState(false);
  const [isJoyrideOpen, setIsJoyrideOpen] = useState(false);

  // Memoized processed layers
  const processedLayers = React.useMemo(
    () =>
      layers.map((layer) => ({
        ...layer,
        data: {
          ...layer.data,
          features: layer.data.features.map((feature, index) => {
            const rowId =
              feature.properties?.id || `${layer.id || "layer"}-${index}`;
            return {
              ...feature,
              id: rowId,
            } as ExtendedFeature;
          }),
        },
      })),
    [layers]
  );

  const selectedLayer = processedLayers.find(
    (layer) => layer.id === selectedLayerId
  );

  // Memoized data
  const data = React.useMemo(
    () =>
      selectedLayer?.data.features.map((feature) => ({
        id: feature.id,
        ...feature.properties,
      })) || [],
    [selectedLayer]
  );

  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    setFilteredData(data); // Reset filtered data when data changes
  }, [data]);

  const handleSubmit = () => {
    if (rowSelectionModel.length === 0) {
      enqueueSnackbar("Please select rows to create a new layer.", {
        variant: "warning",
        autoHideDuration: 2500,
      });
      return;
    }

    const selectedFeatures = selectedLayer?.data.features.filter((feature) =>
      rowSelectionModel.includes(feature.id)
    );

    if (selectedFeatures && selectedFeatures.length > 0) {
      const newLayer: FeatureCollection<Geometry, GeoJsonProperties> = {
        type: "FeatureCollection",
        features: selectedFeatures,
      };

      addLayer(
        newLayer,
        getRandomColor(),
        `${selectedLayer?.name}_Filtered`,
        true
      );
      enqueueSnackbar("New layer created successfully!", {
        variant: "success",
        autoHideDuration: 2500,
      });
      onClose();
    } else {
      enqueueSnackbar("No valid features selected.", {
        variant: "error",
        autoHideDuration: 2500,
      });
    }
  };

  const toggleFilterRow = () => {
    setIsFilterRowVisible((prev) => {
      if (prev) {
        setFilteredData(data); // Reset to all rows when hiding the filter row
      }
      return !prev;
    });
  };

  useEffect(() => {
    if (initialSelectedLayerId) {
      setSelectedLayerId(initialSelectedLayerId);
    }
  }, [initialSelectedLayerId]);

  const handleJoyrideStart = () => setIsJoyrideOpen(true);
  const joyrideSteps: Step[] = [
    {
      target: "#attribute-table-modal",
      content:
        "Now you are going to make a layer of Solvangen kindergarten by filtering the attribute table.",
      disableBeacon: true,
      spotlightClicks: true,
      placement: "bottom",
    },
    {
      target: "#layer-select",
      content: "Select 'barnehager' from the dropdown list.",
      disableBeacon: true,
      spotlightClicks: true,
      placement: "bottom",
      styles: {
        overlay: {
          pointerEvents: "none",
        },
      },
    },
    {
      target: "#filter-button",
      content: "Click to filter on attributes.",
      disableBeacon: true,
      spotlightClicks: true,
      placement: "bottom",
    },
    {
      target: "#attribute-select",
      content: "Choose the 'barnehagenavn' attribute.",
      disableBeacon: true,
      spotlightClicks: true,
      placement: "top",
      styles: {
        overlay: {
          pointerEvents: "none",
        },
      },
    },
    {
      target: "#operation-select",
      content: "Choose the 'starts with' operation.",
      disableBeacon: true,
      spotlightClicks: true,
      placement: "top",
      styles: {
        overlay: {
          pointerEvents: "none",
        },
      },
    },
    {
      target: "#filter-value",
      content:
        "Write 'Solvangen' in the filter value field. Remember capital 'S'.",
      disableBeacon: true,
      spotlightClicks: true,
      placement: "top",
      styles: {
        overlay: {
          pointerEvents: "none",
        },
      },
    },
    {
      target: "#apply-filter",
      content:
        "Click to filter on this rule. The matching rows will be selected.",
      disableBeacon: true,
      spotlightClicks: true,
      placement: "top",
    },
    {
      target: "#attribute-table-grid",
      content:
        "Inspect the information in the table, and assure that the row with 'Solvangen barnehage' in the 'barnehagenavn' attribute is selected.",
      disableBeacon: true,
      spotlightClicks: true,
      placement: "top",
    },
    {
      target: "#submit-button",
      content: "Click to create layer with the selected row.",
      disableBeacon: true,
      spotlightClicks: true,
      placement: "top",
    },
  ];

  return (
    <>
      <ModalContainer
        open={open}
        onClose={onClose}
        header="Attribute Table"
        headerId="attribute-table-modal"
        submitLabel="Create Layer With Selected Rows"
        onSubmit={handleSubmit}
        modalWidth={900}
        tutorialHelp={true}
        openTutorial={handleJoyrideStart}
      >
        <Box sx={{ maxHeight: "78vh", overflowY: "auto" }}>
          <AttributeTableLayerSelector
            layers={processedLayers}
            selectedLayerId={selectedLayerId}
            setSelectedLayerId={setSelectedLayerId}
            toggleFilterRow={toggleFilterRow}
            isFilterRowVisible={isFilterRowVisible}
          />
          {isFilterRowVisible && (
            <AttributeTableFiltering
              attributes={data}
              onFilterChange={(filtered) => {
                setFilteredData(filtered || data); // Reset to all rows if no filter applied
                setRowSelectionModel((filtered || data).map((row) => row.id)); // Automatically select filtered rows
              }}
            />
          )}
          <AttributeTableGrid
            id="attribute-table-grid"
            selectedLayerId={selectedLayerId}
            data={filteredData}
            rowSelectionModel={rowSelectionModel}
            setRowSelectionModel={(model) => setRowSelectionModel(model)}
          />
        </Box>
      </ModalContainer>

      {/* React Joyride */}
      <TutorialDetails
        steps={joyrideSteps}
        run={open && isJoyrideOpen}
        onClose={() => setIsJoyrideOpen(false)}
      />
    </>
  );
};

export default AttributeTableModal;
