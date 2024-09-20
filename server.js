const express = require('express');
const fs = require('fs');
const path = require('path');


const app = express();
const port = 3000;

// Middleware to parse JSON body from POST requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static('public'));

// Serve vocabularies from the vocabularies folder
app.get('/vocabularies/:language', (req, res) => {
    const language = req.params.language;
    const filePath = path.join(__dirname, 'vocabularies', `${language}.json`);

    // Check if the vocabulary file exists
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: `Vocabulary for language '${language}' not found.` });
    }
});

// API endpoint to add new vocabulary
app.post('/vocabularies/:language', (req, res) => {
    const language = req.params.language;
    const newVocabulary = req.body;

    const filePath = path.join(__dirname, 'vocabularies', `${language}.json`);

    // Read the existing file (or create an empty array if it doesn't exist)
    let vocabularies = [];
    if (fs.existsSync(filePath)) {
        vocabularies = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    // Add the new vocabulary to the array
    vocabularies.push(newVocabulary);

    // Write the updated vocabulary list back to the file
    fs.writeFileSync(filePath, JSON.stringify(vocabularies, null, 2));

    res.status(200).json({ message: 'Vocabulary added successfully!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Vocabulary trainer app listening at http://localhost:${port}`);
});
