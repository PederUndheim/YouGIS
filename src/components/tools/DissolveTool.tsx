import React, { useState } from "react";
import { Typography, Box } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { useSnackbar } from "notistack";
import {
  useLayerDataContext,
  useLayerActionContext,
} from "../../context/LayerContext";
import ModalContainer from "../containers/ModalContainer";
import CustomSelectField from "../ui/CustomSelectField";
import CustomTextField from "../ui/CustomTextField";
import { FeatureCollection, Polygon } from "geojson";
import { dissolve } from "@turf/dissolve";
import { getRandomColor } from "../../utils/colorUtils";

const DissolveTool: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const { layers } = useLayerDataContext();
  const { addLayer } = useLayerActionContext();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedLayerId, setSelectedLayerId] = useState<string>("");
  const [selectedField, setSelectedField] = useState<string>("");
  const [outputLayerName, setOutputLayerName] = useState<string>("");
  const [layerSelectionError, setLayerSelectionError] =
    useState<boolean>(false);
  const [fieldSelectionError, setFieldSelectionError] =
    useState<boolean>(false);
  const [outputLayerNameError, setOutputLayerNameError] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isOutputNameModified, setIsOutputNameModified] =
    useState<boolean>(false);

  const polygonLayers = layers.filter((layer) => layer.type === "Polygon");

  const validateInputs = () => {
    const isLayerSelected = selectedLayerId !== "";
    const isFieldSelected = selectedField !== "";
    const isOutputLayerNameValid = outputLayerName !== "";

    setLayerSelectionError(!isLayerSelected);
    setFieldSelectionError(!isFieldSelected);
    setOutputLayerNameError(!isOutputLayerNameValid);

    return isLayerSelected && isFieldSelected && isOutputLayerNameValid;
  };

  const executeDissolve = (): boolean => {
    const layer = polygonLayers.find((layer) => layer.id === selectedLayerId);

    if (!layer) {
      setErrorMessage("Selected layer could not be found.");
      return false;
    }

    try {
      const inputFeatures: FeatureCollection<Polygon> = {
        type: "FeatureCollection",
        features: layer.data.features.filter(
          (feature) => feature.geometry?.type === "Polygon"
        ) as FeatureCollection<Polygon>["features"],
      };

      const result = dissolve(inputFeatures, { propertyName: selectedField });

      if (result && result.features.length > 0) {
        addLayer(result, getRandomColor(), outputLayerName, true);
        enqueueSnackbar("Dissolve operation successful!", {
          variant: "success",
          autoHideDuration: 2500,
        });
        setErrorMessage("");
        return true;
      } else {
        setErrorMessage("Dissolve operation returned no results.");
        return false;
      }
    } catch (error) {
      console.error("Error during dissolve operation:", error);
      setErrorMessage("An error occurred during the dissolve operation.");
      return false;
    }
  };

  const handleSubmit = () => {
    if (validateInputs()) {
      const success = executeDissolve();
      if (success) {
        onClose();
      }
    }
  };

  const handleLayerChange = (event: SelectChangeEvent<unknown>) => {
    const layerId = event.target.value as string;
    setSelectedLayerId(layerId);
    setLayerSelectionError(false);

    // Find the selected layer
    const layer = polygonLayers.find((layer) => layer.id === layerId);
    if (layer && !isOutputNameModified) {
      const firstField = Object.keys(
        layer.data.features[0]?.properties || []
      )[0];
      setOutputLayerName(`dissolve_${layer.name}_${firstField || "none"}`);
    }

    // Populate fields for the selected layer
    const fieldKeys = Object.keys(layer?.data.features[0]?.properties || {});
    setSelectedField(fieldKeys[0] || "");
  };

  const handleFieldChange = (event: SelectChangeEvent<unknown>) => {
    const fieldName = event.target.value as string;
    setSelectedField(fieldName);
    setFieldSelectionError(false);

    // Update output layer name dynamically if not manually modified
    if (!isOutputNameModified && selectedLayerId) {
      const layer = polygonLayers.find((layer) => layer.id === selectedLayerId);
      if (layer) {
        setOutputLayerName(`dissolve_${layer.name}_${fieldName}`);
      }
    }
  };

  const handleOutputLayerNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOutputLayerName(e.target.value);
    setIsOutputNameModified(true);
    setOutputLayerNameError(false);
  };

  return (
    <ModalContainer
      open={open}
      onClose={onClose}
      header="Dissolve Tool"
      submitLabel="Run Dissolve"
      onSubmit={handleSubmit}
      headermargin={0.5}
    >
      <Box sx={{ mb: 3 }}>
        <Typography mx={{ fontSize: "0.7rem", color: "#ECAC7A", mb: 2 }}>
          Polygon layers only
        </Typography>
        {errorMessage && (
          <Typography sx={{ color: "red", fontSize: "0.8rem" }}>
            {errorMessage}
          </Typography>
        )}
      </Box>

      <CustomSelectField
        label="Select Layer"
        value={selectedLayerId}
        options={polygonLayers.map((layer) => ({
          value: layer.id,
          label: layer.name,
        }))}
        onChange={handleLayerChange}
        error={layerSelectionError}
        helperText={layerSelectionError ? "Please select a valid layer." : ""}
      />

      <CustomSelectField
        label="Select Field for Dissolve"
        value={selectedField}
        options={
          polygonLayers.find((layer) => layer.id === selectedLayerId)?.data
            .features[0]?.properties
            ? Object.keys(
                polygonLayers.find((layer) => layer.id === selectedLayerId)
                  ?.data.features[0].properties || {}
              ).map((key) => ({ value: key, label: key }))
            : []
        }
        onChange={handleFieldChange}
        error={fieldSelectionError}
        helperText={fieldSelectionError ? "Please select a valid field." : ""}
        disabled={selectedLayerId === ""}
      />

      <CustomTextField
        label="Output Layer Name"
        value={outputLayerName}
        onChange={handleOutputLayerNameChange}
        error={outputLayerNameError}
        helperText={
          outputLayerNameError ? "Please enter an output layer name." : ""
        }
        InputLabelProps={{
          shrink: true,
        }}
      />
    </ModalContainer>
  );
};

export default DissolveTool;
