// const express = require("express");
// const cors = require("cors");
// const app = express();
// const fs = require("fs");
// const path = require("path");

// // Middleware do parsowania JSON
// app.use(cors());
// app.use(express.json());

// // Serwowanie statycznych plików z folderu 'public'
// app.use(express.static("public"));

// // Endpoint dla ścieżki root
// app.get("/", (req, res) => {
// 	res.send("Hello, World!");
// });

// // Funkcja pomocnicza do czytania danych z pliku db.json
// const readData = (callback) => {
// 	const dbPath = path.join(__dirname, "db.json");
// 	fs.readFile(dbPath, "utf8", (err, data) => {
// 		if (err) {
// 			callback(err, null);
// 		} else {
// 			callback(null, JSON.parse(data));
// 		}
// 	});
// };

// // Funkcja pomocnicza do zapisu danych do pliku db.json
// const writeData = (data, callback) => {
// 	const dbPath = path.join(__dirname, "db.json");
// 	fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf8", (err) => {
// 		callback(err);
// 	});
// };

// // Endpointy dla różnych zasobów
// app.get("/women", (req, res) => {
// 	readData((err, data) => {
// 		if (err) {
// 			return res.status(500).send("Error reading database file.");
// 		}
// 		res.json(data.women || []);
// 	});
// });

// app.get("/men", (req, res) => {
// 	readData((err, data) => {
// 		if (err) {
// 			return res.status(500).send("Error reading database file.");
// 		}
// 		res.json(data.men || []);
// 	});
// });

// app.get("/children", (req, res) => {
// 	readData((err, data) => {
// 		if (err) {
// 			return res.status(500).send("Error reading database file.");
// 		}
// 		res.json(data.children || []);
// 	});
// });

// app.get("/products", (req, res) => {
// 	readData((err, data) => {
// 		if (err) {
// 			return res.status(500).send("Error reading database file.");
// 		}
// 		res.json(data.products || []);
// 	});
// });

// app.get("/favourites", (req, res) => {
// 	readData((err, data) => {
// 		if (err) {
// 			return res.status(500).send("Error reading database file.");
// 		}
// 		res.json(data.favourites || []);
// 	});
// });

// app.post("/favourites", (req, res) => {
// 	const { productId } = req.body;
// 	if (!productId) {
// 		return res.status(400).send("Product ID is required");
// 	}

// 	readData((err, data) => {
// 		if (err) {
// 			return res.status(500).send("Error reading database file.");
// 		}

// 		const product = data.products.find((p) => p.id === productId);
// 		if (!product) {
// 			return res.status(404).send("Product not found");
// 		}

// 		data.favourites.push(product);
// 		writeData(data, (err) => {
// 			if (err) {
// 				return res.status(500).send("Error writing to database file.");
// 			}
// 			res.status(201).send("Product added to favourites");
// 		});
// 	});
// });

// // Endpointy dla bestsellerów w różnych kategoriach
// app.get("/women/bestsellers", (req, res) => {
// 	readData((err, data) => {
// 		if (err) {
// 			return res.status(500).send("Error reading database file.");
// 		}
// 		const womenBestsellers = data.women.bestsellers || [];
// 		res.json(womenBestsellers);
// 	});
// });

// app.get("/men/bestsellers", (req, res) => {
// 	readData((err, data) => {
// 		if (err) {
// 			return res.status(500).send("Error reading database file.");
// 		}
// 		const menBestsellers = data.men.bestsellers || [];
// 		res.json(menBestsellers);
// 	});
// });

// app.get("/children/bestsellers", (req, res) => {
// 	readData((err, data) => {
// 		if (err) {
// 			return res.status(500).send("Error reading database file.");
// 		}
// 		const childrenBestsellers = data.children.bestsellers || [];
// 		res.json(childrenBestsellers);
// 	});
// });

// app.get("/bestsellers", (req, res) => {
//     readData((err, data) => {
//         if (err) {
//             return res.status(500).send("Error reading database file.");
//         }

//         const bestsellers = {
//             women: data.women.bestsellers || [],
//             men: data.men.bestsellers || [],
//             children: data.children.bestsellers || []
//         };

//         res.json(bestsellers);
//     });
// });

// const port = process.env.PORT || 8888;

// // Uruchomienie serwera
// app.listen(port, () => {
// 	console.log(`Server is running on port ${port}`);
// });


const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({ static: './build' });
const port = process.env.PORT || 8000;
const cors = require('cors');
const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

server.use(cors(corsOptions));

server.use(middlewares);
server.use(router);

server.listen(port);