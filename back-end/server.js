const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');

app.use(express.static('public'));

app.get('/data', (req, res) => {
    const dbPath = path.join(__dirname, 'db.json');
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading database file.');
        }
        res.send(JSON.parse(data));
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
