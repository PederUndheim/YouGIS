import React from "react";
import TurfPolygonTool from "./TurfPolygonTool";
import union from "@turf/union";
import { TurfPolygonToolProps } from "./TurfPolygonTool";

const UnionTool: React.FC<TurfPolygonToolProps> = ({ open, onClose }) => {
  return (
    <TurfPolygonTool
      open={open}
      onClose={onClose}
      operationLabel="Union"
      turfFunction={union}
    />
  );
};

export default UnionTool;
