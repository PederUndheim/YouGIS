// tutorialSteps.ts
import React from "react";
import yey from "../../assets/tutorial/yey.png";
import help from "../../assets/tutorial/help.png";
import clip from "../../assets/tutorial/clip.png";
import lakes from "../../assets/tutorial/lakes.png";
import SchoolIcon from "@mui/icons-material/School";
import buffer from "../../assets/tutorial/buffer.png";
import gapHook from "../../assets/tutorial/gap_hook.webp";
import addLayer from "../../assets/tutorial/add_layer.png";
import intersect from "../../assets/tutorial/intersect.png";
import solvangen from "../../assets/tutorial/solvangen.png";
import forest_3km from "../../assets/tutorial/forest_3km.png";
import lake_buffer from "../../assets/tutorial/lake_buffer.png";
import create_layer from "../../assets/tutorial/create_layer.png";
import tutorialMenu from "../../assets/tutorial/tutorial_menu.png";
import downloadData from "../../assets/tutorial/download_data.png";
import layerStyling from "../../assets/tutorial/layer_styling.png";
import done_download from "../../assets/tutorial/done_download.png";
import basemapButton from "../../assets/tutorial/basemap_button.png";
import attributeTable from "../../assets/tutorial/attribute_table.png";
import forest_potential from "../../assets/tutorial/forest_potential.png";
import add_create_layer from "../../assets/tutorial/add_create_layer.png";
import drawn_polygon_map from "../../assets/tutorial/drawn_polygon_map.png";

export interface TutorialStep {
  header: string;
  content: React.ReactNode;
}

export const stepContent: TutorialStep[] = [
  {
    header: "Welcome to YouGIS!",
    content: (
      <div>
        <p>
          This tutorial will guide you through some of the basic features of the
          app, and will hopefully help you get started.
        </p>
        <p>
          Click at the cross in the top right corner or anywhere outside this
          box to pause the tutorial. You can then do the task.
        </p>
        <p>
          Resume and manage the tutorial by hovering the speed dial menu in the
          upper right corner.
        </p>
        <div>
          <img src={tutorialMenu} style={{ width: "250px", height: "auto" }} />
        </div>
        <p>
          Click <span style={{ fontWeight: "bold" }}>Next</span> to continue.
        </p>
      </div>
    ),
  },
  {
    header: "Information",
    content: (
      <div>
        <ul
          style={{
            textAlign: "left",
            width: "85%",
            gap: 2,
            marginBottom: "35px",
          }}
        >
          <li style={{ marginBottom: "7px" }}>
            Google Chrome is the recommended browser.
          </li>
          <li style={{ marginBottom: "7px" }}>
            All your work will be{" "}
            <span style={{ textDecoration: "underline" }}>lost</span> if you{" "}
            <span style={{ textDecoration: "underline" }}>refresh</span> the
            page.
          </li>
          <li style={{ marginBottom: "13px" }}>
            The left- and right-arrow keys can be used to navigate the steps of
            this tutorial.
          </li>
          <li>
            In many of the steps in this tutorial, a more detailed guide-through
            of the specific task is provided when clicking the{" "}
            <SchoolIcon
              sx={{
                paddingTop: "3px",
                marginBottom: "-3px",
                fontSize: "1.0rem",
              }}
            />
            -symbol. This is often to be found in bottom left corner of the
            modal.
          </li>
        </ul>
        <div>
          <img src={help} style={{ width: "350px", height: "auto" }} />
        </div>
      </div>
    ),
  },
  {
    header: "You've got a mission!",
    content: (
      <div>
        <p>
          Solvangen kindergarten wants to build a nature hut for the children to
          enjoy outdoor activities, and has hired YOU to find good options for
          the location.
        </p>
        <div>
          <img src={gapHook} style={{ width: "350px", height: "auto" }} />
        </div>
        <p style={{ textAlign: "left", paddingLeft: "10px" }}>
          <span style={{ fontWeight: "bold" }}>
            Here are some requirements to the location:
          </span>
        </p>
        <ul
          style={{
            textAlign: "left",
            width: "85%",
            gap: 2,
            marginBottom: "20px",
          }}
        >
          <li style={{ marginBottom: "7px" }}>In a forested area</li>
          <li style={{ marginBottom: "7px" }}>
            Within 3 km from the kindergarten
          </li>
          <li style={{ marginBottom: "7px" }}>
            Closer than 100 meters to a lake
          </li>
          <li>As close as possible to a popular hiking trail</li>
        </ul>
        <p>
          <span style={{ fontWeight: "bold", fontSize: "1rem" }}>
            Good luck!
          </span>
        </p>
      </div>
    ),
  },
  {
    header: "Load data",
    content: (
      <div>
        <p>
          Before you can start working, you need to load some data. Please click
          on{" "}
          <a
            href="https://github.com/PederUndheim/YouGIS/blob/main/src/data/tutorial_data.zip"
            target="_blank"
            style={{ color: "#00aaff", textDecoration: "underline" }}
          >
            this link
          </a>{" "}
          to a data folder at GitHub, and download the data.
        </p>
        <p>The position of the download button can be seen below.</p>
        <div>
          <img src={downloadData} style={{ width: "370px", height: "auto" }} />
        </div>
        <p>When downloaded, unpack the files on your computer.</p>
      </div>
    ),
  },
  {
    header: "Add data to the map",
    content: (
      <div>
        <p>
          Now that you have downloaded the data, the next step is to add the
          data as layers on the map. This is done by clicking the{" "}
          <span style={{ fontWeight: "bold" }}>plus-symbol</span> shown in the
          image below.
        </p>
        <p>
          To continue, you have to pause the tutorial by clicking outside of
          this box or clicking the cross. Remember that you continue the
          tutorial afterwards with the tutorial button in the right corner of
          the app.
        </p>
        <div>
          <img src={addLayer} style={{ width: "350px", height: "auto" }} />
        </div>
        <p>
          <span style={{ fontWeight: "lighter" }}>
            <span style={{ fontWeight: "bold" }}>NB!</span> Remember to look for
            the{" "}
            <SchoolIcon
              sx={{
                paddingTop: "6px",
                marginBottom: "-3px",
                fontSize: "1.0rem",
              }}
            />
            -symbol in the pop-up for adding data layers for a detailed
            guide-through of the task.
          </span>
        </p>
      </div>
    ),
  },
  {
    header: "Layer Handling",
    content: (
      <div>
        <p>
          In the sidebar to the left in the app, you can see the map layers.
          General operations are placed at top, while operations for one
          specific layer are placed on each layer row.
        </p>
        <p>
          You can (un)select more layers with the classical keys for file
          handling. (
          <span style={{ fontWeight: "lighter" }}>
            Shift- and ctrl/command-key is useful.
          </span>
          )
        </p>
        <p>
          Play around with the map layer list to get to know how it works. Try
          to <span style={{ fontWeight: "bold" }}>drag and drop</span> the
          layers to change the visibility order, and click the eye to change the{" "}
          <span style={{ fontWeight: "bold" }}>visibility</span> of the layer.
          You can also <span style={{ fontWeight: "bold" }}>zoom to</span> one
          specific layer by right-clicking or clicking the three dots-menu.
        </p>
        <p>
          Also change the colors of the layers to achieve a better visually
          understanding of your mission. Click the{" "}
          <span style={{ fontWeight: "bold" }}>edit-icon</span>, and change the
          colors as you want. The image below shows an exmaple of what colors
          one could use.
        </p>
        <div>
          <img src={layerStyling} style={{ width: "360px", height: "auto" }} />
        </div>
        <p>
          <span style={{ fontWeight: "lighter" }}>
            Remember the{" "}
            <SchoolIcon
              sx={{
                paddingTop: "6px",
                marginBottom: "-3px",
                fontSize: "1.0rem",
              }}
            />
            -symbol for detailed steps.
          </span>
        </p>
      </div>
    ),
  },
  {
    header: "Change Map Style",
    content: (
      <div>
        <p>
          Explore different basemaps by clicking on this mapstyle-button shown
          in the image below, located in the top right corner.
        </p>
        <div>
          <img src={basemapButton} style={{ width: "300px", height: "auto" }} />
        </div>
      </div>
    ),
  },
  {
    header: "Find Solvangen kindergarten",
    content: (
      <div>
        <p>
          To start your mission, you must find the location of the kindergarten
          that wants you to help them.
        </p>
        <p>
          To do so, the{" "}
          <span style={{ fontWeight: "bold" }}>attribute table</span> come in
          handy. In this table you can inspect the information of a layer, and
          eventually create a new layer based on property filtering.
        </p>
        <p>
          You find the attribute table by clicking on the button shown in the
          image below, or by right-clicking/go to the three dots-menu of the
          wanted layer.
        </p>
        <div>
          <img
            src={attributeTable}
            style={{ width: "360px", height: "auto" }}
          />
        </div>
        <p>
          Find the{" "}
          <SchoolIcon
            sx={{
              paddingTop: "6px",
              marginBottom: "-3px",
              fontSize: "1.0rem",
            }}
          />
          -symbol in the attribute table for further information of how to
          create a new layer showing{" "}
          <span style={{ fontWeight: "lighter" }}>Solvangen kindergarten</span>.
        </p>
      </div>
    ),
  },
  {
    header: "Organize layers",
    content: (
      <div>
        <p>
          Now, and further in this mission it is a good idea to keep the layers
          well organized.
        </p>
        <p>
          Give the new layer the suitable name "Solvangen barnehage". Give it a
          visible color and keep only some of the layers visible to gain better
          control.
        </p>
        <div>
          <img src={solvangen} style={{ width: "390px", height: "auto" }} />
        </div>
      </div>
    ),
  },
  {
    header: "Make buffer around the kindergarten",
    content: (
      <div>
        <p>
          From the requirements, you know that you are looking for a forested
          area within <span style={{ fontWeight: "bold" }}>3 km</span> from the
          kindergarten.
        </p>
        <p>
          To find these, you can use the{" "}
          <span style={{ fontWeight: "bold" }}>Buffer</span>-tool to first
          create a buffer around the kindergarten.
        </p>
        <div>
          <img src={buffer} style={{ width: "360px", height: "auto" }} />
        </div>
        <p>Open this tool by clicking the button shown in the image. </p>
        <p>
          <span style={{ fontWeight: "lighter" }}>
            Find the{" "}
            <SchoolIcon
              sx={{
                paddingTop: "6px",
                marginBottom: "-3px",
                fontSize: "1.0rem",
              }}
            />
            -symbol in the buffer-tool for the detailed steps.
          </span>
        </p>
      </div>
    ),
  },
  {
    header: "Clip the forest layer",
    content: (
      <div>
        <p>
          Next, you have to clip the forest layer to this new buffer you made to
          retrieve the nearby forested areas. This is done by using the{" "}
          <span style={{ fontWeight: "bold" }}>Clip</span>-tool.
        </p>
        <div>
          <img src={clip} style={{ width: "360px", height: "auto" }} />
        </div>
        <p>Open this tool by clicking the button shown in the image. </p>
        <p>
          <span style={{ fontWeight: "lighter" }}>
            Find the{" "}
            <SchoolIcon
              sx={{
                paddingTop: "6px",
                marginBottom: "-3px",
                fontSize: "1.0rem",
              }}
            />
            -symbol in the clip-tool for detailed steps.
          </span>
        </p>
      </div>
    ),
  },
  {
    header: "Filter water layer to find lakes",
    content: (
      <div>
        <p>The image below shows a clean view of the current progress.</p>
        <div>
          <img src={forest_3km} style={{ width: "380px", height: "auto" }} />
        </div>
        <p>
          One of the requirements of the location was to be closer than 100
          meters to a lake. By visually inspecting the water bodies close to the
          nearby forested areas, you can observe that there is also a river in
          the area.
        </p>
        <p>
          Use the <span style={{ fontWeight: "bold" }}>attribute table</span> to
          create a new layer containing only the lakes. Go back to step 8 and
          find the{" "}
          <SchoolIcon
            sx={{
              paddingTop: "3px",
              marginBottom: "-3px",
              fontSize: "1.0rem",
            }}
          />
          -symbol in the attribute table for an example of how to do this if in
          doubt.
        </p>
        <p>Name the new layer "innsjø" and give it a visible color.</p>
        <p
          style={{
            textAlign: "left",
            paddingLeft: "10px",
            marginBottom: "5px",
          }}
        >
          <span style={{ fontWeight: "bold" }}>Use these filter criteria:</span>
        </p>
        <ul
          style={{
            textAlign: "left",
            width: "85%",
            gap: 2,
            marginBottom: "20px",
            marginTop: "0px",
          }}
        >
          <li style={{ marginBottom: "7px" }}>
            <span style={{ fontWeight: "lighter" }}>Attribute</span>:
            objekttypenavn
          </li>
          <li style={{ marginBottom: "7px" }}>
            <span style={{ fontWeight: "lighter" }}>Operation</span>: equals
          </li>
          <li style={{ marginBottom: "7px" }}>
            <span style={{ fontWeight: "lighter" }}>Value</span>: Innsjø
          </li>
        </ul>
      </div>
    ),
  },
  {
    header: "Make buffer around the lakes",
    content: (
      <div>
        <p>The current progress is shown below. Only lakes are visible.</p>
        <div>
          <img src={lakes} style={{ width: "380px", height: "auto" }} />
        </div>
        <p>
          Now, your next step is to find the forest areas that are both nearby{" "}
          <span style={{ fontWeight: "bold" }}>and</span> closer than 100 meters
          from a lake.
        </p>
        <p>
          The first thing to do is to use the{" "}
          <span style={{ fontWeight: "bold" }}>Buffer</span>-tool again and
          create a buffer around the lakes.
        </p>
        <p>
          <p
            style={{
              textAlign: "left",
              paddingLeft: "10px",
              marginBottom: "5px",
            }}
          >
            <span style={{ fontWeight: "bold" }}>Use these inputs:</span>
          </p>
          <ul
            style={{
              textAlign: "left",
              width: "85%",
              gap: 2,
              marginBottom: "20px",
              marginTop: "0px",
            }}
          >
            <li style={{ marginBottom: "7px" }}>
              <span style={{ fontWeight: "lighter" }}>Select Layer</span>:
              innsjø
            </li>
            <li style={{ marginBottom: "7px" }}>
              <span style={{ fontWeight: "lighter" }}>Buffer Radius</span>: 100
            </li>
            <li style={{ marginBottom: "7px" }}>
              <span style={{ fontWeight: "lighter" }}>Outout Layer Name</span>:
              innsjø_100m
            </li>
          </ul>
        </p>
        <p>
          <span style={{ fontWeight: "lighter" }}>
            Go back to step 10 and find the{" "}
            <SchoolIcon
              sx={{
                paddingTop: "3px",
                marginBottom: "-3px",
                fontSize: "1.0rem",
              }}
            />
            -symbol in the buffer tool for an example of how to do this if in
            doubt.
          </span>
        </p>
      </div>
    ),
  },
  {
    header: "Find forested areas close to a lake",
    content: (
      <div>
        <p>The image below shows the current progress.</p>
        <div>
          <img src={lake_buffer} style={{ width: "360px", height: "auto" }} />
        </div>
        <p>
          To extract the forested areas that now are both nearby the
          kindergarten and closer than 100 meters to a lake, use the{" "}
          <span style={{ fontWeight: "bold" }}>Intersect</span>-tool.
        </p>
        <p>Open this tool by clicking the button shown in the image below.</p>
        <div>
          <img src={intersect} style={{ width: "300px", height: "auto" }} />
        </div>
        <p>
          <span style={{ fontWeight: "lighter" }}>
            Find the{" "}
            <SchoolIcon
              sx={{
                paddingTop: "6px",
                marginBottom: "-3px",
                fontSize: "1.0rem",
              }}
            />
            -symbol in the intersect-tool for further detailed steps on how to
            perform the intersection.
          </span>
        </p>
      </div>
    ),
  },
  {
    header: "Evaluation of potential areas",
    content: (
      <div>
        <p>
          The image below shows the potential areas, based on the first three
          requirements.
        </p>
        <div>
          <img
            src={forest_potential}
            style={{ width: "360px", height: "auto" }}
          />
        </div>
        <p>
          Now, the only requirement left not yet considered, is the wish for the
          area to be as close as possible to a popular hiking trail.
        </p>
        <p>
          At this point, you could have done more operations to get closer to
          the best option, but you can also inspect the results you got so far
          and make a decision based on what you see.
        </p>
        <p>
          Click <span style={{ fontWeight: "bold" }}>Next</span> to learn how to
          extract the final location by drawing a polygon.
        </p>
        <p>
          <span style={{ fontWeight: "lighter" }}>
            Note that the only potential area that a popular hiking trail is
            going through, is the topmost of the bigger areas.
          </span>
        </p>
      </div>
    ),
  },
  {
    header: "Draw a polygon over the best suited area",
    content: (
      <div>
        <p>
          To create a new custom drawed layer, click on the icon for adding
          layers shown in the image below.
        </p>
        <div>
          <img
            src={add_create_layer}
            style={{ width: "250px", height: "auto" }}
          />
        </div>
        <p style={{ marginTop: "0px" }}>
          In the pop-up for adding new layers to the map, click on the{" "}
          <span style={{ fontWeight: "lighter" }}>CREATE LAYER</span>-tab shown
          in the image below.
        </p>
        <div>
          <img src={create_layer} style={{ width: "360px", height: "auto" }} />
        </div>
        <p>
          <span style={{ fontWeight: "lighter" }}>
            Find the{" "}
            <SchoolIcon
              sx={{
                paddingTop: "6px",
                marginBottom: "-3px",
                fontSize: "1.0rem",
              }}
            />
            -symbol in the create layer-tab for further detailed steps on how to
            create the custom polygon layer.
          </span>
        </p>
      </div>
    ),
  },
  {
    header: "Extract the final location",
    content: (
      <div>
        <p>
          The image below shows the new layer that was drawn over the best
          suited location.
        </p>
        <div>
          <img
            src={drawn_polygon_map}
            style={{ width: "300px", height: "auto" }}
          />
        </div>
        <p>
          To extract the final location, you can use the{" "}
          <span style={{ fontWeight: "bold" }}>Clip</span>-tool again.
        </p>
        <p>Go back to step 11 if you have forgotten how to clip layers.</p>
        <p>
          <p
            style={{
              textAlign: "left",
              paddingLeft: "10px",
              marginBottom: "5px",
            }}
          >
            <span style={{ fontWeight: "bold" }}>Use these inputs:</span>
          </p>
          <ul
            style={{
              textAlign: "left",
              width: "85%",
              gap: 2,
              marginBottom: "20px",
              marginTop: "0px",
            }}
          >
            <li style={{ marginBottom: "7px" }}>
              <span style={{ fontWeight: "lighter" }}>
                Select Layer to Clip
              </span>
              : skog_potensiell
            </li>
            <li style={{ marginBottom: "7px" }}>
              <span style={{ fontWeight: "lighter" }}>
                Select Polygon to Clip To
              </span>
              : polygon_område
            </li>
            <li style={{ marginBottom: "7px" }}>
              <span style={{ fontWeight: "lighter" }}>Outout Layer Name</span>:
              område_ferdig
            </li>
          </ul>
        </p>
      </div>
    ),
  },
  {
    header: "Download layer of final location",
    content: (
      <div>
        <p>
          In the image below the final location is green, visiualized together
          with the popular hiking trails, lakes and the kindergarten for better
          context.
        </p>
        <div>
          <img src={done_download} style={{ width: "370px", height: "auto" }} />
        </div>
        <p>
          <span style={{ fontWeight: "bold" }}>Select</span> the layer with the
          final location, and click on the download-button shown in the image.
        </p>
        <p>
          Click <span style={{ fontWeight: "ligther" }}>DOWNLOAD</span> in the
          pop-up to download the layer.
        </p>
        <p>Remember to provide your recommended area to the kindergarten ;)</p>
      </div>
    ),
  },
  {
    header: "Mission Completed!",
    content: (
      <div>
        <p>
          <span style={{ fontWeight: "bold" }}>Congratulations!</span> You have
          now completed the mission and found a suitable location for the nature
          hut.
        </p>
        <p>
          Hope you enjoyed this tutorial and got inspired to explore more of the
          opportunities in the world of GIS!
        </p>
        <div>
          <img src={yey} style={{ width: "370px", height: "auto" }} />
        </div>
      </div>
    ),
  },
];
