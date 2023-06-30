const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
   name: { type: String, required: true }, 
   email: { type: String, required: true },
   phone: { type: String},
   imageUrl: { type: String, required: true },
   group: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact'},

});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;