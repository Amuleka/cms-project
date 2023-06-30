const mongoose = require('mongoose');

const sequenceSchema = new mongoose.Schema({
  maxDocumentId: { type: Number, required: true },
  maxMessageId: { type: Number, required: true },
  maxContactId: { type: Number, required: true }
});

const Sequence = mongoose.model('Sequence', sequenceSchema);

module.exports = Sequence;
