const express = require('express');
const mongoose = require('mongoose');
const Client = require('../models/client');
const Commande = require('../models/commande');
const router = express.Router();

// Passer une commande
router.post('/', async (req, res) => {
    try {
        const { clientId, pizzas, utilisePizzaOfferte } = req.body;

        if (!mongoose.Types.ObjectId.isValid(clientId)) {
            return res.status(400).json({ message: 'ID client invalide' });
        }

        const client = await Client.findById(clientId);
        if (!client) return res.status(404).json({ message: 'Client non trouvé' });

        let pizzaOfferteUtilisee = false;
        if (utilisePizzaOfferte) {
            const offreDisponible = client.pizzasOffertes.find(o => !o.utilisee);
            if (offreDisponible) {
                offreDisponible.utilisee = true;
                pizzaOfferteUtilisee = true;
            } else {
                return res.status(400).json({ message: '❌ Aucune pizza offerte disponible.' });
            }
        }

        const nouvelleCommande = new Commande({
            clientId,
            pizzas,
            utilisePizzaOfferte: pizzaOfferteUtilisee
        });

        await nouvelleCommande.save();
        await client.save();

        res.status(201).json(nouvelleCommande);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
