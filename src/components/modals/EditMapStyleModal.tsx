import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import {
  useLayerDataContext,
  useLayerActionContext,
} from "../../context/LayerContext";
import ModalContainer from "../containers/ModalContainer";
import streetsImg from "../../assets/mapStyles/streets.png";
import outdoorsImg from "../../assets/mapStyles/outdoors.png";
import lightImg from "../../assets/mapStyles/light.png";
import darkImg from "../../assets/mapStyles/dark.png";
import satelliteImg from "../../assets/mapStyles/satellite.png";
import satelliteStreetsImg from "../../assets/mapStyles/satellite_streets.png";
import navigationDayImg from "../../assets/mapStyles/navigation_day.png";
import navigationNightImg from "../../assets/mapStyles/navigation_night.png";

const mapStyles = [
  {
    id: "streets-v12",
    name: "Streets",
    imageUrl: streetsImg,
    mapboxStyle: "mapbox://styles/mapbox/streets-v12",
  },
  {
    id: "outdoors-v12",
    name: "Outdoors",
    imageUrl: outdoorsImg,
    mapboxStyle: "mapbox://styles/mapbox/outdoors-v12",
  },
  {
    id: "light-v11",
    name: "Light",
    imageUrl: lightImg,
    mapboxStyle: "mapbox://styles/mapbox/light-v11",
  },
  {
    id: "dark-v11",
    name: "Dark",
    imageUrl: darkImg,
    mapboxStyle: "mapbox://styles/mapbox/dark-v11",
  },
  {
    id: "satellite-v9",
    name: "Satellite",
    imageUrl: satelliteImg,
    mapboxStyle: "mapbox://styles/mapbox/satellite-v9",
  },
  {
    id: "satellite-streets-v12",
    name: "Satellite Streets",
    imageUrl: satelliteStreetsImg,
    mapboxStyle: "mapbox://styles/mapbox/satellite-streets-v12",
  },
  {
    id: "navigation-day-v1",
    name: "Navigation Day",
    imageUrl: navigationDayImg,
    mapboxStyle: "mapbox://styles/mapbox/navigation-day-v1",
  },
  {
    id: "navigation-night-v1",
    name: "Navigation Night",
    imageUrl: navigationNightImg,
    mapboxStyle: "mapbox://styles/mapbox/navigation-night-v1",
  },
];

interface EditMapStyleModalProps {
  open: boolean;
  onClose: () => void;
}

const EditMapStyleModal: React.FC<EditMapStyleModalProps> = ({
  open,
  onClose,
}) => {
  const { baseMap } = useLayerDataContext();
  const {
    setBaseMap,
    saveLayerVisibilityState,
    refreshLayerVisibilityWithState,
  } = useLayerActionContext();

  const handleMapStyleChange = (newMapStyle: string) => {
    saveLayerVisibilityState();
    setBaseMap(newMapStyle);
    refreshLayerVisibilityWithState();
  };

  return (
    <ModalContainer
      open={open}
      onClose={onClose}
      header="Choose Map Style"
      submitLabel="Confirm"
      onSubmit={onClose}
      modalWidth={600}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          paddingY: 2,
          gap: 3,
          maxWidth: 580,
          margin: "0 auto",
          "@media (max-width: 500px)": {
            maxWidth: "100%", // For smaller screens, let it adjust
          },
        }}
      >
        {mapStyles.map((style) => (
          <Box
            key={style.id}
            sx={{
              textAlign: "center",
              width: 120,
            }}
          >
            <IconButton
              onClick={() => handleMapStyleChange(style.mapboxStyle)}
              sx={{
                borderRadius: "50%",
                border:
                  baseMap === style.mapboxStyle
                    ? "4px solid #A8D99C"
                    : "2px solid transparent",
                padding: 0,
                overflow: "hidden",
                width: 120,
                height: 120,
                transition: "transform 0.2s, border 0.2s",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            >
              <img
                src={style.imageUrl}
                alt={style.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </IconButton>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                marginTop: 1,
                fontWeight: baseMap === style.mapboxStyle ? "bold" : "normal",
                color: baseMap === style.mapboxStyle ? "#A8D99C" : "inherit",
              }}
            >
              {style.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </ModalContainer>
  );
};

export default EditMapStyleModal;
