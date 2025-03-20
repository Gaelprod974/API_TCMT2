const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telephone: { type: String, required: true },
    adresse: { type: String, required: true },
    pizzasAchetees: { type: Number, default: 0 },
    pizzasOffertes: [{ utilisee: { type: Boolean, default: false } }]
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
