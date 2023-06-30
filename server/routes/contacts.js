const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');
const sequenceGenerator = require('./sequenceGenerator');

// GET /contacts
router.get('/', (req, res, next) => {
  Contact.find()
    .populate('group')
    .exec()
    .then(contacts => {
      res.status(200).json(contacts);
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// POST /contacts
router.post('/', (req, res, next) => {
  const contact = new Contact({
    id: sequenceGenerator.nextId('contacts'),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    imageUrl: req.body.imageUrl,
    group: req.body.group
  });

  contact.save()
    .then(createdContact => {
      res.status(201).json({
        message: 'Contact added successfully',
        contact: createdContact
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// PUT /contacts/:id
router.put('/:id', (req, res, next) => {
  const contactId = req.params.id;

  Contact.findOneAndUpdate({ id: contactId }, req.body)
    .then(updatedContact => {
      if (!updatedContact) {
        return res.status(404).json({
          message: 'Contact not found',
          error: { contact: 'Contact not found' }
        });
      }

      res.status(200).json({
        message: 'Contact updated successfully',
        contact: updatedContact
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// DELETE /contacts/:id
router.delete("/:id", (req, res, next) => {
  const contactId = req.params.id;

  Contact.findOneAndDelete({ id: contactId })
    .then(deletedContact => {
      if (!deletedContact) {
        return res.status(404).json({
          message: 'Contact not found',
          error: { contact: 'Contact not found' }
        });
      }

      res.status(204).json({
        message: 'Contact deleted successfully'
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
