import React, { useState } from "react";
import MapContainer from "./components/containers/MapContainer";
import ToolBar from "./components/containers/ToolBar";
import Sidebar from "./components/containers/Sidebar";
import { CircularProgress } from "@mui/material";
import UserButtonsContainer from "./components/containers/UserButtonsContainer";
import { LayerProvider } from "./context/LayerContext"; // Adjust the import path
import { TempLayerProvider } from "./context/TempLayerContext"; // Adjust the import path
import { SnackbarProvider } from "notistack";

const App: React.FC = () => {
  const [loading] = useState<boolean>(false);
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(true);
  const [toolBarOpen, setToolBarOpen] = useState<boolean>(true);
  const [currentWidth, setCurrentWidth] = useState<number>(350); // Initial width of the sidebar

  const handleToggleDrawer = () => {
    setSideBarOpen(!sideBarOpen);
  };

  const handleToggleToolBar = () => {
    setToolBarOpen(!toolBarOpen);
  };

  const handleResize = (newWidth: number) => {
    setCurrentWidth(newWidth);
  };

  return (
    <LayerProvider>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div
          style={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Main Content Area */}
          <div style={{ display: "flex", flexGrow: 1, position: "relative" }}>
            {/* Sidebar */}
            <TempLayerProvider>
              <Sidebar
                isOpen={sideBarOpen}
                currentWidth={currentWidth}
                onToggle={handleToggleDrawer}
                onResize={handleResize}
                style={{ zIndex: 2000 }}
              />
            </TempLayerProvider>
            <ToolBar isOpen={toolBarOpen} onToggle={handleToggleToolBar} />

            {/* User Buttons */}
            <UserButtonsContainer />

            {/* Map Container */}
            <div
              style={{
                position: "absolute", // Keep it absolutely positioned
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1, // Lower z-index for the map
                overflow: "hidden", // Prevent any overflow issues
              }}
            >
              <MapContainer
                style={{ width: "100%", height: "100%" }}
                onDrawingFinish={(data) => {
                  console.log("Drawing finished:", data);
                }}
              />

              {/* Loading Spinner */}
              {loading && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 2000, // Ensure spinner is on top
                  }}
                >
                  <CircularProgress />
                </div>
              )}
            </div>
          </div>
        </div>
      </SnackbarProvider>
    </LayerProvider>
  );
};

export default App;
