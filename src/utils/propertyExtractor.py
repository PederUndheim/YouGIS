import geopandas as gpd
import os

def choose_properties(gdf):
    """
    Prompt the user to choose which properties to include in the output file.
    """
    properties = list(gdf.columns)
    properties.remove("geometry")  # Exclude geometry from selection

    print("\nAvailable properties:")
    for i, prop in enumerate(properties, start=1):
        print(f"{i}: {prop}")

    print("\nSelect properties to include in the output GeoJSON:")
    print("Enter the numbers separated by commas (e.g., 1,3,5), or press Enter to include all.")
    user_input = input("Your selection: ").strip()

    if user_input:
        try:
            selected_indices = [int(i) - 1 for i in user_input.split(",")]
            selected_properties = [properties[i] for i in selected_indices]
            print(f"Selected properties: {selected_properties}")
            return selected_properties
        except (ValueError, IndexError):
            print("Invalid input. Including all properties.")
    else:
        print("Including all properties.")

    return properties  # Include all properties if no valid selection is made

def filter_attributes(input_geojson, output_geojson):
    """
    Filter attributes of a GeoJSON file based on user selection.
    
    Parameters:
        input_geojson (str): Path to the input GeoJSON file.
        output_geojson (str): Path to save the filtered GeoJSON file.
    """
    try:
        print(f"Reading GeoJSON file: {input_geojson}")
        gdf = gpd.read_file(input_geojson)

        # Prompt user to choose properties
        selected_properties = choose_properties(gdf)

        # Keep only selected properties and geometry
        gdf = gdf[selected_properties + ["geometry"]]

        # Save the filtered GeoJSON
        print(f"Saving filtered GeoJSON to {output_geojson}")
        gdf.to_file(output_geojson, driver="GeoJSON")

        print("Filtering completed successfully!")
    except Exception as e:
        print(f"An error occurred during filtering: {e}")

# Example Usage
if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_geojson = os.path.join(script_dir, "files/input/barnehager.geojson")
    output_geojson = os.path.join(script_dir, "files/output/barnehager.geojson")

    # Call the filtering function
    filter_attributes(input_geojson, output_geojson)
