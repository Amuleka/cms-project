const Sequence = require('../models/sequence');

class SequenceGenerator {
  constructor() {
    this.maxDocumentId = null;
    this.maxMessageId = null;
    this.maxContactId = null;
    this.sequenceId = null;
  }

  async initialize() {
    try {
      const sequence = await Sequence.findOne().exec();
      if (sequence) {
        this.sequenceId = sequence._id;
        this.maxDocumentId = sequence.maxDocumentId;
        this.maxMessageId = sequence.maxMessageId;
        this.maxContactId = sequence.maxContactId;
      } else {
        const newSequence = new Sequence();
        await newSequence.save();
        this.sequenceId = newSequence._id;
      }
    } catch (error) {
      throw new Error('An error occurred while initializing SequenceGenerator.');
    }
  }

  async nextId(collectionType) {
    let updateObject = {};
    let nextId = null;

    switch (collectionType) {
      case 'documents':
        this.maxDocumentId++;
        updateObject = { maxDocumentId: this.maxDocumentId };
        nextId = this.maxDocumentId;
        break;
      case 'messages':
        this.maxMessageId++;
        updateObject = { maxMessageId: this.maxMessageId };
        nextId = this.maxMessageId;
        break;
      case 'contacts':
        this.maxContactId++;
        updateObject = { maxContactId: this.maxContactId };
        nextId = this.maxContactId;
        break;
      default:
        return -1;
    }

    try {
      await Sequence.updateOne({ _id: this.sequenceId }, { $set: updateObject });
      return nextId;
    } catch (error) {
      console.log('nextId error:', error);
      return null;
    }
  }
}

module.exports = new SequenceGenerator();
