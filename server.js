const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json()); // Parse JSON request bodies

app.get('/images', (req, res) => {
  const imagesFolder = path.join(__dirname, 'public', 'images');

  fs.readdir(imagesFolder, (err, files) => {
    if (err) {
      console.error('Error reading images folder:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const imageFiles = files.filter(file => {
      const extension = path.extname(file).toLowerCase();
      return extension === '.jpg' || extension === '.png';
    });

    res.json(imageFiles);
  });
});

// Handle POST request to store the test result
app.post('/result', (req, res) => {
  const { userName, selectedImagePath } = req.body;

  // Write the test result to a file
  const resultData = `${userName},${selectedImagePath}\n`;
  fs.appendFile('results.csv', resultData, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(200).json({ message: 'Test result stored successfully' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});