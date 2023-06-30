const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
   subject: { type: String },
   msgText: { type: String, required: true },
   sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact'}
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;