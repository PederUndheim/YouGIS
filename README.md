# **Web GIS Application TBA4251**

Welcome to the **Web GIS Application**, developed as part of the NTNU 4th year course **TBA4251 "Programming in Geomatics"**. This application is designed for non-professional GIS users with minimal experience in geospatial data analysis, offering an intuitive interface for basic geographic data processing and visualization.

Try it now: [Live Application](https://lauvsnes1.github.io/TBA4251-PiG/)  
Watch a demo: [YouTube Video](https://youtu.be/xOLmTdqVv5g)

---

## **Table of Contents**

1. [Introduction](#introduction)
2. [Purpose](#purpose)
3. [Features](#features)
4. [Usage](#usage)
5. [Run Locally](#run-locally)
6. [Tech Stack](#tech-stack)
7. [Further Development](#further-development)
8. [Acknowledgments](#acknowledgments)

---

## **Introduction**

This application was built to make geographic data analysis accessible and user-friendly. It enables users to perform basic GIS tasks, such as spatial analysis, geoprocessing, and data visualization. The project serves as an introduction to geographic data processing for students and non-professionals.

---

## **Purpose**

The application's main goal is to:

- Present geographic data in a straightforward and visually appealing manner.
- Support simple geospatial analysis for users with little to no GIS experience.
- Provide an easy-to-follow tutorial so even first-year Geomatics students can use it effectively.

---

## **Features**

- Upload and visualize GeoJSON/JSON files.
- Perform geoprocessing operations, such as:
  - **Difference**
  - **Intersect**
  - **Union**
  - **Bounding Box (Bbox)**
  - **Clip**
  - **Voronoi Diagrams**
  - **Attribute Filtering**
- Zoom to any location worldwide, with the map centered on Trondheim, Norway.
- Integrated step-by-step tutorial accessible via the settings menu.
- Export processed results as files.

---

## **Usage**

### **Live Version**

Access the application directly in your browser:  
[https://lauvsnes1.github.io/TBA4251-PiG/](https://lauvsnes1.github.io/TBA4251-PiG/)

### **Uploading Data**

1. Drag and drop GeoJSON files into the designated area.
2. Ensure the file extension is `.json` (rename `.geojson` files if necessary).
3. Supported coordinate system:
   - **Projection**: Latitude/Longitude
   - **Datum**: WGS 84
   - **EPSG Code**: 4326

### **Tutorial**

- Click the settings icon in the top-right corner.
- Select "Start Tutorial" to follow an example exercise, such as identifying optimal fishing spots in Trondheimsfjorden.

---

## **Run Locally**

To run the application locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/yougis.git
   cd yougis
   ```

## **Tech Stack**

This application leverages the following technologies and libraries:

- **Frontend Framework**: React (v18.2.0)
- **Programming Language**: TypeScript (v4.9.5)
- **Mapping**: Mapbox-GL (v2.13.0), React-Map-GL (v7.0.21)
- **Geospatial Analysis**: Turf.js (v6.5.0)
- **UI Components**: Material-UI, React Joyride (v2.0.5) for tutorials
- **File Management**: file-saver, jszip
- **Other Tools**:
  - [react-toastify](https://fkhadra.github.io/react-toastify) for notifications
  - [react-color](https://casesandberg.github.io/react-color/) for layer styling

---

## **Further Development**

This project serves as a foundation for simple GIS tasks but has room for growth:

### **Planned Improvements**

- Styling layers based on properties (categorical/choropleth).
- Adding 3D support with extrusion layers.
- Drawing tools for creating new features.
- Support for more file formats (e.g., shapefiles, CSV).
- Adding WMS layer integration.
- Compatibility with additional coordinate systems.

### **Known Issues**

- Layers sometimes render out of order when multiple are uploaded simultaneously.
- Input validation needs improvement to handle improper data gracefully.

---

## **Acknowledgments**

This project was made possible through:

- **NTNU Course TBA4251** "Programming in Geomatics".
- Tools and libraries including:
  - [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/)
  - [Turf.js](http://turfjs.org/)
  - [Material-UI](https://mui.com/)

Special thanks to open-source contributors and collaborators who made this application possible.
