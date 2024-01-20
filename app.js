const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save files in the "uploads" directory
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}${ext}`);
  }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Use consistent endpoint names
app.post('/saveData', upload.single('image'), (req, res) => {
  const formData = req.body;

  // Process the form data and generate JSON
  const jsonData = {
    path: req.file ? req.file.filename : null
    // Include other form fields as needed
  };

  // Save the JSON to a file
  fs.writeFileSync('path.json', JSON.stringify(jsonData, null, 2));

  res.json({ message: 'JSON file generated successfully' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
