const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
   name: { type: String, required: true }, 
   url: { type: String, required: true },
   description: { type: String },

});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
