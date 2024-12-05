import React, { useState } from "react";
import { Tabs, Tab, Typography, Box } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CreateIcon from "@mui/icons-material/Create";
import { useLayerActionContext } from "../../context/LayerContext";
import { useTempLayerContext } from "../../context/TempLayerContext";
import ModalContainer from "../containers/ModalContainer";
import TempLayerList from "../partials/TempLayerList";
import UploadLayerTab from "../partials/UploadLayerTab";
import CreateLayerTab from "../partials/CreateLayerTab";
import { enqueueSnackbar } from "notistack";
import MapDrawModal from "./MapDrawModal";
import { getRandomColor } from "../../utils/colorUtils";
import { FeatureCollection } from "geojson";
import { Step } from "react-joyride";
import TutorialDetails from "../tutorial/DetailedTutorial";
import drawn_polygon from "../../assets/tutorial/drawn_polygon.png";

interface AddLayerModalProps {
  open: boolean;
  onClose: () => void;
}

const AddLayerModal: React.FC<AddLayerModalProps> = ({ open, onClose }) => {
  const { addLayer } = useLayerActionContext();
  const { tempLayers, clearTempLayers } = useTempLayerContext();
  const [activeTab, setActiveTab] = useState(0);
  const [drawingMode, setDrawingMode] = useState<
    "Point" | "LineString" | "Polygon" | null
  >(null);
  const [layerName, setLayerName] = useState("");
  const [mapDrawOpen, setMapDrawOpen] = useState(false);
  const [temporaryDrawing, setTemporaryDrawing] =
    useState<FeatureCollection | null>(null);
  const [isJoyrideOpen, setIsJoyrideOpen] = useState(false);

  // Handle tab changes
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Handle file upload completion
  const handleFilesUploaded = () => {};

  // Validate inputs and trigger drawing
  const handleLayerCreate = (
    name: string,
    geometryType: "Point" | "LineString" | "Polygon"
  ) => {
    if (!name.trim()) {
      return;
    }

    if (!geometryType) {
      return;
    }

    setLayerName(name);
    setDrawingMode(geometryType);
    setMapDrawOpen(true);
  };

  const handleDrawingFinish = (data: FeatureCollection) => {
    setTemporaryDrawing(data);
    console.log(temporaryDrawing);
  };

  const handleClearDrawing = () => {
    setTemporaryDrawing(null);
  };

  const handleConfirmDrawing = (data: FeatureCollection) => {
    addLayer(
      data,
      getRandomColor(),
      layerName || `custom_${drawingMode}`,
      true
    );
    setMapDrawOpen(false);
    enqueueSnackbar("Layer added successfully!", { variant: "success" });
    setDrawingMode(null);
    setLayerName("");
    onClose();
  };

  // Handle modal submission (upload layers)
  const handleSubmit = () => {
    tempLayers.forEach((layer) => {
      addLayer(layer.data, layer.color, layer.name);
    });
    clearTempLayers();
    const numLayers = tempLayers.length;
    enqueueSnackbar(`${numLayers} layer(s) uploaded successfully!`, {
      variant: "success",
      autoHideDuration: 2500,
    });
    onClose();
  };

  const handleJoyrideStart = () => setIsJoyrideOpen(true);
  const joyrideSteps: Step[] =
    activeTab === 0
      ? [
          {
            target: "#file-upload",
            content: "Click here to upload the downloaded geojson-files.",
            disableBeacon: true,
            spotlightClicks: true,
            placement: "bottom",
          },
          {
            target: "#submit-upload-button",
            content: "Click here to submit the uploaded layers.",
            disableBeacon: true,
            spotlightClicks: true,
            placement: "bottom",
          },
        ]
      : [
          {
            target: "#geometry-type",
            content: "Select 'Polygon' as geometry type.",
            disableBeacon: true,
            spotlightClicks: true,
            placement: "bottom",
          },
          {
            target: "#layer-name",
            content: "Name the new layer 'polygon_område'.",
            disableBeacon: true,
            spotlightClicks: true,
            placement: "bottom",
          },
          {
            target: "#start-drawing-button",
            content: (
              <div>
                <p>Click to start drawing the layer on the map.</p>
                <p>
                  <span style={{ fontWeight: "lighter", fontSize: "0.8rem" }}>
                    When clicking the button, a new map opens. You can zoom and
                    pan the map as normal. When clicking the map, the drawing
                    starts, and you click for the different corners of the
                    polygon. When done, double-click/right-click to finish the
                    drawing.
                  </span>
                </p>
                <p>
                  <span style={{ fontWeight: "lighter", fontSize: "0.8rem" }}>
                    If you make a mistake, click cancel, and thereafter start
                    the drawing again. When finished, click{" "}
                    <span style={{ fontWeight: "bold" }}>Add Layer</span>.
                  </span>
                </p>
                <p>
                  In the image below you see an example of how to draw the
                  suitable polygon over the best location for the nature hut.
                </p>
                <div>
                  <img
                    src={drawn_polygon}
                    style={{ width: "300px", height: "auto" }}
                  />
                </div>
              </div>
            ),
            disableBeacon: true,
            spotlightClicks: true,
            placement: "bottom",
          },
        ];

  return (
    <>
      <ModalContainer
        open={open}
        onClose={onClose}
        header="Add new layer(s) to the map"
        submitLabel={activeTab === 0 ? "Submit" : "Start Drawing"}
        onSubmit={
          activeTab === 0
            ? handleSubmit
            : () => handleLayerCreate(layerName, drawingMode!)
        } // Call appropriate function
        disableSubmit={
          activeTab === 0
            ? tempLayers.length === 0 && !drawingMode
            : !layerName.trim() || !drawingMode // Disable if no layer name or geometry type in Create tab
        }
        tutorialHelp={true}
        openTutorial={handleJoyrideStart}
        submitButtonProps={{
          id: activeTab === 0 ? "submit-upload-button" : "start-drawing-button",
          label: activeTab === 0 ? "Submit" : "Start Drawing", // Include required label
          handleSubmit:
            activeTab === 0
              ? handleSubmit
              : () => handleLayerCreate(layerName, drawingMode!), // Pass appropriate function
          disabled:
            activeTab === 0
              ? tempLayers.length === 0
              : !layerName.trim() || !drawingMode, // Ensure disabled state is consistent
        }}
      >
        {/* Tabs for Upload and Create */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="primary"
          aria-label="add layer tabs"
          sx={{
            marginBottom: 2,
            "& .MuiTab-root": {
              color: "#ffffff",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#ECAC7A",
            },
          }}
        >
          <Tab
            icon={<FileUploadIcon />}
            iconPosition="end"
            label="Upload Layer"
          />
          <Tab icon={<CreateIcon />} iconPosition="end" label="Create Layer" />
        </Tabs>

        {/* Upload Layer Tab */}
        {activeTab === 0 && (
          <UploadLayerTab onFilesUploaded={handleFilesUploaded} />
        )}

        {/* Create Layer Tab */}
        {activeTab === 1 && (
          <CreateLayerTab
            onLayerCreate={handleLayerCreate}
            layerName={layerName}
            setLayerName={setLayerName}
            geometryType={drawingMode}
            setGeometryType={setDrawingMode}
          />
        )}

        {/* Temp Layers Preview */}
        {tempLayers.length > 0 && (
          <Box sx={{ ml: 2, mb: 0, mt: 1 }}>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Add the following layers to the map:
            </Typography>
          </Box>
        )}

        {tempLayers.length > 0 && (
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "scroll",
              maxHeight: "40vh",
              mt: 0,
            }}
          >
            <TempLayerList />
          </Box>
        )}
      </ModalContainer>

      {/* Pass props to MapContainer-Popup */}
      <MapDrawModal
        open={mapDrawOpen}
        onClose={() => setMapDrawOpen(false)}
        drawingMode={drawingMode}
        onDrawingFinish={handleDrawingFinish}
        onClear={handleClearDrawing}
        onConfirm={handleConfirmDrawing}
      />

      {/* React Joyride */}
      <TutorialDetails
        steps={joyrideSteps}
        run={open && isJoyrideOpen}
        onClose={() => setIsJoyrideOpen(false)}
      />
    </>
  );
};

export default AddLayerModal;
