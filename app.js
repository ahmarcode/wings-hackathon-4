const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
  destination: 'uploads', // Use forward slashes
  filename: (req, file, callback) => {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/submit', upload.single('documentImage'), (req, res) => {
  // Generate JSON file with the path
  const jsonPath = { path: req.file.path };

  // Write JSON data to path.json file
  fs.writeFileSync('C:/Users/verne/Desktop/fake set up/path.json', JSON.stringify(jsonPath, null, 2));

  // Read existing verdict.json file
  fs.readFile('C:/Users/verne/Desktop/fake set up/verdict.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading verdict.json:', err);
      return res.status(500).send('Internal Server Error');
    }

    // Parse the existing verdict data
    const verdictData = JSON.parse(data);

    // Send the verdict data to the client
    res.status(200).json(verdictData);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
