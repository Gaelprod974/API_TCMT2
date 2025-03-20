const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const clientRoutes = require('./routes/clientRoutes');
const commandeRoutes = require('./routes/commandeRoutes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connexion MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connecté"))
  .catch((err) => console.log("❌ Erreur MongoDB:", err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/clients', clientRoutes);
app.use('/api/commandes', commandeRoutes);

// Route de test
app.get('/', (req, res) => {
    res.send('API Poz-pizza fonctionnelle ! 🍕');
});

// Lancement en local
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Serveur sur http://localhost:${PORT}`));

module.exports = app; // ⚠️ Important pour Vercel
