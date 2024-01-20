const vision = require('@google-cloud/vision');
const Jimp = require('jimp');
const jsQR = require('jsqr');
const fs = require('fs');
const imagePath = '';
const SectorPath = 'left_bottom_sector.jpg';

const CREDENTIALS = JSON.parse(JSON.stringify({
    "type": "service_account",
    "project_id": "jovial-hawk-404515",
    "private_key_id": "baea310b5d076508c5a9e7807dfc023b71dadf36",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC/j6+PFMSuyZCO\nR7+3nyJ0T8ZJ7kNYJPqDKxLSWq1hZDqXlw1l1k/HrqV9J+ZOyRRjLCb2AGPOZJ5/\ncTLywqzmJOq8LGJk+V6iDIxexayd2aXjNks//GpqlIuenwiWbfVYTNXJkWsH85i5\nsNhV22FAHnUlg0i20nU2KH/GEpdxe5IUJfBZOs1i8ARLBfXTFAUubCNg2Mv37y+y\nvz0h7gHjSL6+R1g+S1uxNUQ2+xE3itnQllroDAtDtWr9OC7inX4PkCvmbA8Zq/VL\ncMBlsP0Syooqf03bOh73PdUaYDxCCzLunKj2hAhkK49DAa915wrvfOOHOHwVvIAl\nKhBnmNCDAgMBAAECggEAGqhEJgUd2bTzCNmzNDpQ8R6o2WDuvjVnJxm3ZM55kjQA\nc1fx5VoNgBwtq10CD7SrwaFDSriDKxWVeOan0GCG7v/0KnuCtcp+AM7+ObIIc272\nRsgncKAPrwU86LX42/YxTjhjB8nUuyaK+kxBzrDYt7OFWdMLK2XeKcs4/LdZm9D4\nOatmeObnEqCUW8EkSCbBgmtJx7T5x9bSroXrnsIxaIVJ0VW6hYMtvrUvhUnSk+Yt\nAaQDYxBkvIXdNa1ha2Iilagqo0qLGu64n3WButDKBlPLjMq37lRdEdyPPnhZVFel\nmVlOVa+KMACErYPIYQEfifhQ1C2wqPBvFTasWfaoAQKBgQD8ZRVgwBuz1b7tm/Cb\nrqeMMMJCAFJa2hj6bEk37iilMPe3E9LdjYd/D+fB6a0H+G3UWqGESOdzrQ8/s3X7\n0cTt2MUC3WhCB/uEhUW2FqZYZhM9UzUmn6a+wKqSVIKkiOrKzsG4xWPVxhMaONk2\nc7eKFifaueKtP1+Av+TPAs4VIQKBgQDCTCfpTUsdU30+T0QPU7iNZJpEjJL5vUIm\nwNSAIWsVbzWRXFIDW38N+wuJpJ8bRoCzgEHyRMNc1wZ1EcUk5aFg1mEotq4QSKfO\nsRyijWYg4cYRilBO8171Ja/5QZxAPLExwKwDiFC04EPkBznSst+LUQcIc41dBfCI\nqywPhfFNIwKBgCJMck1Fjf4wS9PqXxYo8+ffMGbbuFVUUhSl5oVNPgTE1MTyUrN8\n6i7gMHRvlu4AWpyC/HQHnDxiBjJ35s6jwQk5bfxnriVbBFkL619FULGunWq2BgEL\nrRM7B3L/PQmy+YU596VuXZTNaAcmNo5px0VioWPd4un8NLRAX42qKetBAoGBAIKA\nynHuo5w//qiCbzFoR1ZZEzElxnaOA0eqT1D8oUNVXgKTotZ0d0N5socyFlgoo7tt\nU14Zh6rtFn49gFBHGHzFoZ7KDOINGwE+fwBDvywo2XPglg5hcw9vz+G4iu2ulknX\novIAdkz3MUKRA+qckH+v3ex0SKgJnET/y+llSu1HAoGAe/fcGRaXdFHMC9Ge6c1c\ndAVYmObtXfwyFyYUFz36d95V5sgM/Xiqkrm/WY6+rnaHqls5HbdyZ94+DnjxqIKY\nvNuyxB3hJNzcPHkNTNs5tIbnd/ef5Om9EHZcsndfPJyxesJ3wQRQbPtSGg4F/ZqK\ndyo4i012PKRrb5kvWiO/9hk=\n-----END PRIVATE KEY-----\n",
    "client_email": "compserinstance-jovial-hawk-40@jovial-hawk-404515.iam.gserviceaccount.com",
    "client_id": "108716351021941201299",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/compserinstance-jovial-hawk-40%40jovial-hawk-404515.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }
))

const CONFIG = {
    credentials: {
        private_key: CREDENTIALS.private_key,
        client_email: CREDENTIALS.client_email
    }
};

const client = new vision.ImageAnnotatorClient(CONFIG);

const jsonFilePath = 'image.json';

const detectTextAndSave = async (file_path) => {
    try {
        let [result] = await client.textDetection(file_path);
        const detectedText = result.fullTextAnnotation.text;

        // Read existing data from the JSON file
        let jsonData = {};
        try {
            const existingData = fs.readFileSync(jsonFilePath, 'utf-8');
            jsonData = JSON.parse(existingData);
        } catch (error) {
            // File doesn't exist or is empty
        }

        // Update data in memory
        jsonData.detectedText = detectedText;

        // Write the updated data back to the JSON file
        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));

        console.log('Text detected and saved to result.json:', detectedText);
    } catch (error) {
        console.error('Error:', error.message);
    }
};

// Example usage
detectTextAndSave(imagePath);

async function scanQRCodeFromImage(imagePath) {
    try {
      // Read the image file using Jimp
      const image = await Jimp.read(imagePath);
  
      // Convert the image to raw pixel data
      const { data, width, height } = image.bitmap;
  
      // Decode the QR code using jsQR
      const code = jsQR(data, width, height);
  
      if (code) {
        console.log('QR Code detected and decoded:');
        console.log(code.data);
  
        // Save the detected QR code to a JSON file
        const jsonFilePath = 'qrResult.json';
        const jsonData = {
          detectedQRCode: code.data,
        };
  
        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));
        console.log('Detected QR Code saved to qrResult.json');
      } else {
        console.log('No QR Code detected in the image.');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  scanQRCodeFromImage(SectorPath);