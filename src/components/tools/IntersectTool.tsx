import React from "react";
import TurfPolygonTool from "./TurfPolygonTool";
import intersect from "@turf/intersect";
import { TurfPolygonToolProps } from "./TurfPolygonTool";

const IntersectTool: React.FC<TurfPolygonToolProps> = ({ open, onClose }) => {
  return (
    <TurfPolygonTool
      open={open}
      onClose={onClose}
      operationLabel="Intersection"
      turfFunction={intersect}
    />
  );
};

export default IntersectTool;
