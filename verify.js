const fs = require('fs');
const sharp = require('sharp');

// Read the JSON file
const jsonString = fs.readFileSync('path.json');
const myDict = JSON.parse(jsonString);
const inputImagePath = myDict.path;

// Function to extract left-bottom sector
async function extractLeftBottomSector(inputPath, outputPath) {
    try {
        // Read the input image
        const inputImageBuffer = await fs.promises.readFile(inputPath);

        // Get the dimensions of the image
        const { width, height } = await sharp(inputImageBuffer).metadata();

        // Calculate coordinates for the left-bottom sector
        const left = 0;
        const top = Math.floor(height / 2); // Top is set to half of the image height
        const right = Math.floor(width / 2); // Right is set to half of the image width
        const bottom = height; // Bottom is set to the full image height

        // Crop and save the image using the calculated coordinates
        await sharp(inputImageBuffer)
            .extract({ left, top, width: right - left, height: bottom - top }) // Fix: Use width and height instead of right and bottom directly
            .toFile(outputPath);
        
        console.log('Image processed successfully.');
    } catch (error) {
        console.error('Error processing image:', error);
    }
}

// Example usage:
const outputImagePath = 'left_bottom_sector.jpg';

// Call the function to extract the left-bottom sector
extractLeftBottomSector(inputImagePath, outputImagePath);
