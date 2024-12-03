import React from "react";
import TurfPolygonTool from "./TurfPolygonTool";
import difference from "@turf/difference";
import { TurfPolygonToolProps } from "./TurfPolygonTool";

const DifferenceTool: React.FC<TurfPolygonToolProps> = ({ open, onClose }) => {
  return (
    <TurfPolygonTool
      open={open}
      onClose={onClose}
      operationLabel="Difference"
      turfFunction={difference}
    />
  );
};

export default DifferenceTool;
