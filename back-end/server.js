// Endpointy dla bestsellerów w różnych kategoriach
app.get("/women/bestsellers", (req, res) => {
	readData((err, data) => {
		if (err) {
			return res.status(500).send("Error reading database file.");
		}
		const womenBestsellers = data.women.bestsellers || [];
		res.json(womenBestsellers);
	});
});

app.get("/men/bestsellers", (req, res) => {
	readData((err, data) => {
		if (err) {
			return res.status(500).send("Error reading database file.");
		}
		const menBestsellers = data.men.bestsellers || [];
		res.json(menBestsellers);
	});
});

app.get("/children/bestsellers", (req, res) => {
	readData((err, data) => {
		if (err) {
			return res.status(500).send("Error reading database file.");
		}
		const childrenBestsellers = data.children.bestsellers || [];
		res.json(childrenBestsellers);
	});
});
