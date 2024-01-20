import json

with open("path.json", "r") as f:
    my_dict = json.load(f)
test = my_dict['path']

from PIL import Image

def extract_left_bottom_sector(input_path, output_path):
    # Open the image file
    image = Image.open(input_path)

    # Get the dimensions of the image
    width, height = image.size

    # Calculate coordinates for the left-bottom sector
    left = 0
    top = height // 2  # Top is set to half of the image height
    right = width // 2  # Right is set to half of the image width
    bottom = height  # Bottom is set to the full image height

    # Crop the image using the calculated coordinates
    cropped_image = image.crop((left, top, right, bottom))

    # Save the cropped image to the output path
    cropped_image.save(output_path)

# Example usage:
input_image_path = test;
output_image_path = 'left_bottom_sector.jpg'

# Call the function to extract the left-bottom sector
extract_left_bottom_sector(input_image_path, output_image_path)
