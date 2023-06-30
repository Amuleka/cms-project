const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const sequenceGenerator = require('./sequenceGenerator');

// GET /messages
router.get('/', (req, res, next) => {
  Message.find()
    .populate('sender')
    .exec()
    .then(messages => {
      res.status(200).json(messages);
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// POST /messages
// POST /messages
router.post('/', (req, res, next) => {
  const maxMessageId = sequenceGenerator.nextId("messages");

  const message = new Message({
    id: maxMessageId,
    subject: req.body.subject,
    msgText: req.body.msgText,
    sender: req.body.sender
  });

  message.save()
    .then(createdMessage => {
      res.status(201).json({
        message: 'Message added successfully',
        createdMessage: createdMessage  // Corrected property name
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});


// PUT /messages/:id
router.put('/:id', (req, res, next) => {
  const messageId = req.params.id;

  Message.findOneAndUpdate({ id: messageId }, req.body)
    .then(updatedMessage => {
      if (!updatedMessage) {
        return res.status(404).json({
          message: 'Message not found',
          error: { message: 'Message not found' }
        });
      }

      res.status(200).json({
        message: 'Message updated successfully',
        message: updatedMessage
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// DELETE /messages/:id
router.delete("/:id", (req, res, next) => {
  const messageId = req.params.id;

  Message.findOneAndDelete({ id: messageId })
    .then(deletedMessage => {
      if (!deletedMessage) {
        return res.status(404).json({
          message: 'Message not found',
          error: { message: 'Message not found' }
        });
      }

      res.status(204).json({
        message: 'Message deleted successfully'
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

module.exports = router;
