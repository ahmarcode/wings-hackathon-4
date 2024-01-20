const fs = require('fs').promises;
let verdict;
function replaceNewlinesWithSpaces(inputString) {
    return inputString.replace(/\n/g, ' ');
}

function separateIntoWords(inputString) {
    const wordRegex = /\b\w+\b/g;
    return inputString.match(wordRegex) || [];
}

async function fetchTargetString() {
    try {
        const fileContent = await fs.readFile('C:/Users/Asus/Desktop/Hackathon/image.json', 'utf-8');

        const data = JSON.parse(fileContent);

        if (data && data.detectedText) {
            return data.detectedText;
        } else {
            throw new Error('Invalid data format');
        }
    } catch (error) {
        console.error('Error reading or parsing data:', error);
        throw error;
    }
}

async function fetchAndProcessString() {
    try {
        const targetString = await fetchTargetString();

        if (targetString) {
            const processedString = replaceNewlinesWithSpaces(targetString);
            return processedString;
        } else {
            throw new Error('Failed to fetch or process the string');
        }
    } catch (error) {
        console.error('Error fetching and processing string:', error);
        throw error;
    }
}

async function areAllKeyStringsPresent(keyString, matchingThreshold = 0.85) {
    try {
        const targetString = await fetchAndProcessString();

        if (!targetString) {
            throw new Error('Target string is empty or undefined');
        }

        const wordsKeyStrings = separateIntoWords(keyString);
        const wordsTargetString = separateIntoWords(targetString);

        const matchingWords = wordsKeyStrings.filter(word =>
            wordsTargetString.includes(word)
        );

        const percentageMatching = matchingWords.length / wordsKeyStrings.length;
        verdict = (percentageMatching >= matchingThreshold)
        console.log(verdict);
        module.exports = verdict;
        return percentageMatching >= matchingThreshold;
        
    } catch (error) {
        console.error('Error checking if key strings are present:', error);
        return false;
    }
}


function readTextFile(filePath) {
    return fs.readFile(filePath, 'utf-8')
        .catch(error => {
            throw new Error(`Error reading file ${filePath}: ${error.message}`);
        });
}

// Example usage
const filePath = './qrResult.json'; // Adjust the path accordingly

let globalData; // Variable to store the extracted value

readTextFile(filePath)
    .then(data => {
        const jsonData = JSON.parse(data);
        const detectedQRCodeValue = jsonData.detectedQRCode;
        globalData = detectedQRCodeValue;
        console.log(globalData);
        const keyString = globalData;
        areAllKeyStringsPresent(keyString)
            .then(result => {
                console.log(result);
                if (result) {
                    console.log("The Document is authentic");
                } else {
                    console.log("The Document iS FORGED.");

                }
            })
            .catch(error => {
                console.error(error);
            });
    })
    .catch(error => console.error(error.message));


