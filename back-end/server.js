const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const fs = require("fs");
const path = require("path");

// Serwowanie statycznych plików z folderu 'public'
app.use(express.static("public"));

// Endpoint dla ścieżki root
app.get("/", (req, res) => {
	res.send("Hello, World!");
});

// Endpoint do zwracania danych z pliku db.json
app.get("/data", (req, res) => {
	const dbPath = path.join(__dirname, "db.json");
	fs.readFile(dbPath, "utf8", (err, data) => {
		if (err) {
			return res.status(500).send("Error reading database file.");
		}
		res.send(JSON.parse(data));
	});
});

// Uruchomienie serwera
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
