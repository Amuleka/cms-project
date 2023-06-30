var express = require('express');
var router = express.Router();
const Document = require('../models/document');
const sequenceGenerator = require('./sequenceGenerator');

// Methods to GET, POST, PUT, DELETE Documents

// GET Doc
router.get('/', (req, res, next) => {
  Document.find()
    .then((documents) => {
      res.status(200).json(documents);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// POST Doc
router.post('/', (req, res, next) => {
  const document = new Document({
    id: sequenceGenerator.nextId('documents'),
    name: req.body.name,
    url: req.body.url,
    description: req.body.description
  });

  document.save()
    .then(createdDocument => {
      res.status(201).json({
        message: 'Document added successfully',
        document: createdDocument
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// UPDATE Doc
router.put('/:id', (req, res, next) => {
  Document.findOne({ id: req.params.id })
    .then(document => {
      if (!document) {
        return res.status(404).json({
          message: 'Document not found.',
          error: { document: 'Document not found' }
        });
      }

      document.name = req.body.name;
      document.description = req.body.description;
      document.url = req.body.url;

      document.save()
        .then(updatedDocument => {
          res.status(200).json({
            message: 'Document updated successfully',
            document: updatedDocument
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// DELETE Doc
router.delete("/:id", (req, res, next) => {
  Document.findOne({ id: req.params.id })
    .then(document => {
      if (!document) {
        return res.status(404).json({
          message: "Document not found.",
          error: { document: "Document not found" }
        });
      }

      Document.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({
            message: "Document deleted successfully"
          });
        })
        .catch(error => {
          res.status(500).json({
            message: "An error occurred",
            error: error
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        message: "An error occurred",
        error: error
      });
    });
});



module.exports = router; 