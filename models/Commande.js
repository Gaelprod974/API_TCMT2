const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    pizzas: { type: Number, required: true },
    dateCommande: { type: Date, default: Date.now },
    utilisePizzaOfferte: { type: Boolean, default: false }
});

module.exports = mongoose.model('Commande', commandeSchema);
