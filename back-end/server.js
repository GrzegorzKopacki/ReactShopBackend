const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const path = require("path");
import {
	GENDERS,
	CATEGORIES,
} from "../../ReactShop/front-end/src/constants/categories";
import { productListLoader } from "../../ReactShop/front-end/src/api/productListLoader";

// Middleware do parsowania JSON
app.use(cors());
app.use(express.json());

// Serwowanie statycznych plików z folderu 'public'
app.use(express.static("public"));

// Endpoint dla ścieżki root
app.get("/", (req, res) => {
	res.send("Hello, World!");
});

// Funkcja pomocnicza do czytania danych z pliku db.json
const readData = (callback) => {
	const dbPath = path.join(__dirname, "db.json");
	fs.readFile(dbPath, "utf8", (err, data) => {
		if (err) {
			callback(err, null);
		} else {
			callback(null, JSON.parse(data));
		}
	});
};

// Funkcja pomocnicza do zapisu danych do pliku db.json
const writeData = (data, callback) => {
	const dbPath = path.join(__dirname, "db.json");
	fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf8", (err) => {
		callback(err);
	});
};

// Endpointy dla różnych zasobów
app.get("/women", (req, res) => {
	readData((err, data) => {
		if (err) {
			return res.status(500).send("Error reading database file.");
		}
		res.json(data.women || []);
	});
});

app.get("/men", (req, res) => {
	readData((err, data) => {
		if (err) {
			return res.status(500).send("Error reading database file.");
		}
		res.json(data.men || []);
	});
});

app.get("/children", (req, res) => {
	readData((err, data) => {
		if (err) {
			return res.status(500).send("Error reading database file.");
		}
		res.json(data.children || []);
	});
});

app.get("/products", (req, res) => {
	readData((err, data) => {
		if (err) {
			return res.status(500).send("Error reading database file.");
		}
		res.json(data.products || []);
	});
});

app.get("/favourites", (req, res) => {
	readData((err, data) => {
		if (err) {
			return res.status(500).send("Error reading database file.");
		}
		res.json(data.favourites || []);
	});
});

app.post("/favourites", (req, res) => {
	const { productId } = req.body;
	if (!productId) {
		return res.status(400).send("Product ID is required");
	}

	readData((err, data) => {
		if (err) {
			return res.status(500).send("Error reading database file.");
		}

		const product = data.products.find((p) => p.id === productId);
		if (!product) {
			return res.status(404).send("Product not found");
		}

		data.favourites.push(product);
		writeData(data, (err) => {
			if (err) {
				return res.status(500).send("Error writing to database file.");
			}
			res.status(201).send("Product added to favourites");
		});
	});
});

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

app.get("/bestsellers", (req, res) => {
	readData((err, data) => {
		if (err) {
			return res.status(500).send("Error reading database file.");
		}

		const bestsellers = {
			women: data.women.bestsellers || [],
			men: data.men.bestsellers || [],
			children: data.children.bestsellers || [],
		};

		res.json(bestsellers);
	});
});

app.get("/api/products", async (req, res) => {
	const { gender, category, subcategory } = req.query;

	try {
		// Sprawdzenie, czy podana płeć jest prawidłowa
		const foundGender = GENDERS.find((g) => g.path === gender);
		if (!foundGender) {
			return res.status(400).json({ error: "Invalid gender" });
		}

		// Sprawdzenie, czy podana kategoria jest prawidłowa
		const foundCategory = CATEGORIES.find((c) => c.path === category);
		if (!foundCategory) {
			return res.status(400).json({ error: "Invalid category" });
		}

		// Wywołaj funkcję productListLoader, aby pobrać dane o produktach
		const { products, numberOfPages } = await productListLoader({
			params: { gender, category, subcategory },
			request: req,
		});

		res.json({ products, numberOfPages });
	} catch (error) {
		// Obsłuż błędy
		if (error.status === 301 || error.status === 302) {
			// Przekierowanie
			return res.redirect(error.location);
		} else {
			// Inne błędy
			return res.status(500).json({ error: "Internal server error" });
		}
	}
});

const port = process.env.PORT || 8888;

// Uruchomienie serwera
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

// const jsonServer = require('json-server');
// const server = jsonServer.create();
// const router = jsonServer.router('db.json');
// const middlewares = jsonServer.defaults({ static: './build' });
// const port = process.env.PORT || 8000;
// const cors = require('cors');
// const corsOptions = {
//   origin: '*',
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };

// server.use(cors(corsOptions));

// server.use(middlewares);
// server.use(router);

// server.listen(port);

// app.get("/products/gender/category/subcategory", (req, res) => {
// 	const { gender, category, subcategory } = req.params;

// 	console.log("Gender:", gender);
// 	console.log("Category:", category);
// 	console.log("Subcategory:", subcategory);

// 	readData((err, data) => {
// 		if (err) {
// 			return res.status(500).send("Error reading database file.");
// 		}

// 		// Wczytaj dane z pliku db.json
// 		const { products } = data;

// 		// Filtrowanie produktów na podstawie parametrów zapytania
// 		let filteredProducts = products.filter((product) => {
// 			// Sprawdź zgodność płci
// 			if (product.gender !== gender) {
// 				return false;
// 			}
// 			// Sprawdź zgodność kategorii
// 			if (product.category !== category) {
// 				return false;
// 			}
// 			// Sprawdź zgodność podkategorii, jeśli jest określona
// 			if (subcategory && product.subcategory !== subcategory) {
// 				return false;
// 			}
// 			// Jeśli subcategory nie jest określone, zwróć produkty bez względu na podkategorie
// 			if (!subcategory && product.subcategory) {
// 				return false;
// 			}
// 			return true;
// 		});

// 		res.json(filteredProducts);
// 	});
// });
