const express = require('express');
const router = express.Router();
const Client = require('../models/client'); // Assurez-vous que le modèle Client est correctement défini

// Route pour créer un nouveau client
router.post('/', async (req, res) => {
    try {
        const { nom, email, telephone, adresse } = req.body;

        // Validation des champs
        if (!nom || !email || !telephone || !adresse) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }

        // Création du client
        const newClient = new Client({
            nom,
            email,
            telephone,
            adresse,
            pizzasAchetees: 0,
            pizzasOffertes: []
        });

        await newClient.save();
        res.status(201).json(newClient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création du client." });
    }
});

// Route pour rechercher des clients par nom
router.get('/rechercher', async (req, res) => {
    try {
        const { nom } = req.query;

        if (!nom) {
            return res.status(400).json({ message: "Le nom est requis pour la recherche." });
        }

        // Recherche des clients dont le nom correspond (ou contient) celui saisi
        const clients = await Client.find({ nom: new RegExp(nom, 'i') }); // 'i' pour ignorer la casse

        if (clients.length === 0) {
            return res.status(404).json({ message: "Aucun client trouvé." });
        }

        res.json(clients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la recherche des clients." });
    }
});

// Route pour acheter des pizzas
router.patch('/:clientId/acheter', async (req, res) => {
    try {
        const { clientId } = req.params;
        const { pizzas } = req.body;

        if (!pizzas || pizzas <= 0) {
            return res.status(400).json({ message: "Le nombre de pizzas doit être positif." });
        }

        const client = await Client.findById(clientId);

        if (!client) {
            return res.status(404).json({ message: "Client non trouvé." });
        }

        // Ajouter les pizzas achetées
        client.pizzasAchetees += pizzas;

        // Ajouter les pizzas offertes si nécessaire
        for (let i = 0; i < pizzas; i++) {
            client.pizzasOffertes.push({ utilisee: false });
        }

        await client.save();
        res.json({ message: `Le client a acheté ${pizzas} pizza(s).`, client });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'achat des pizzas." });
    }
});

// Route pour créer une commande
router.post('/commandes', async (req, res) => {
    try {
        const { clientId, pizzas, utilisePizzaOfferte } = req.body;

        if (!clientId || pizzas <= 0) {
            return res.status(400).json({ message: "L'ID client et le nombre de pizzas sont requis." });
        }

        const client = await Client.findById(clientId);

        if (!client) {
            return res.status(404).json({ message: "Client non trouvé." });
        }

        // Si l'utilisateur souhaite utiliser une pizza offerte
        if (utilisePizzaOfferte) {
            const pizzaOfferte = client.pizzasOffertes.find(p => !p.utilisee);
            if (!pizzaOfferte) {
                return res.status(400).json({ message: "Aucune pizza offerte disponible." });
            }
            pizzaOfferte.utilisee = true;
            await client.save();
        }

        // Logique de création de commande (simple ici)
        res.json({ message: `Commande créée pour ${client.nom} avec ${pizzas} pizza(s).` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création de la commande." });
    }
});

module.exports = router;
