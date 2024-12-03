import React from "react";
import { List, ListItem, ListItemText, Box, Typography } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  useLayerActionContext,
  useLayerDataContext,
} from "../../context/LayerContext";
import { useSelectedLayerContext } from "../../context/LayerContext";
import LayerListItem from "./LayerListItem";
import tutorial from "../../assets/find_tutorial.png";

const LayerList: React.FC = () => {
  const { layers } = useLayerDataContext();
  const { selectedLayerIds, selectLayer, deselectLayer } =
    useSelectedLayerContext();
  const { removeLayer, toggleVisibility, updateLayerStyle, setLayers } =
    useLayerActionContext();

  const handleListItemClick = (layerId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent multiple event triggers

    const isMultiSelect = event.metaKey || event.ctrlKey;
    const isRangeSelect = event.shiftKey;

    if (isRangeSelect) {
      // Add or merge a range selection
      selectLayer(layerId, true, true);
    } else if (isMultiSelect) {
      // Toggle individual layer selection
      selectLayer(layerId, true, false);
    } else {
      // Single selection: Always deselect all others and select only this layer
      deselectAllLayers();
      selectLayer(layerId, false, false);
    }
  };

  const deselectAllLayers = () => {
    selectedLayerIds.forEach((id) => deselectLayer(id));
  };

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedLayers = Array.from(layers);
    const [movedLayer] = reorderedLayers.splice(result.source.index, 1);
    reorderedLayers.splice(result.destination.index, 0, movedLayer);

    if (result.destination.index !== result.source.index) {
      setLayers(reorderedLayers);
    }
  };

  return (
    <Box p={2} mb={3}>
      {layers.length === 0 ? (
        <Box>
          <ListItem sx={{ mt: 1 }}>
            <ListItemText
              primary="No layers available"
              primaryTypographyProps={{
                sx: { paddingBottom: "4px" },
              }}
              secondary="Click on plus-symbol to add layer(s) or start the tutorial to get provided data."
              secondaryTypographyProps={{
                style: { color: "#ECAC7A", fontSize: "0.8rem" },
              }}
            />
          </ListItem>
          <Box
            sx={{
              m: 1,
              mt: 3,
              p: 2,
              border: "1.5px dashed #A8D99C",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div>
              <img src={tutorial} style={{ width: "100%", height: "auto" }} />
            </div>
            <Typography
              variant="caption"
              sx={{ color: "#A8D99C", fontSize: "0.7rem" }}
            >
              Start tutorial by hovering over the tutorial icon in the top right
              corner and click on "Start Tutorial".
            </Typography>
          </Box>
        </Box>
      ) : (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <List {...provided.droppableProps} ref={provided.innerRef}>
                {layers.map((layer, index) => (
                  <Draggable
                    key={layer.id}
                    draggableId={layer.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={(event) =>
                          handleListItemClick(layer.id, event)
                        }
                      >
                        <LayerListItem
                          layer={layer}
                          index={index}
                          deleteLayer={removeLayer}
                          toggleVisibility={toggleVisibility}
                          updateLayerStyle={updateLayerStyle}
                          selected={selectedLayerIds.includes(layer.id)}
                          handleListItemClick={handleListItemClick}
                          isDragging={snapshot.isDragging}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </Box>
  );
};

export default LayerList;
