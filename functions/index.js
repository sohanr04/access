const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const path = require('path');

// This is a wrapper to adapt your existing Express app to Firebase Functions
exports.api = functions.https.onRequest((req, res) => {
  // We need to dynamically import your server app because it uses ESM
  import('../src/server.js')
    .then(module => {
      // Your server app might be exported differently
      const app = module.default || module.app || module;
      
      // Forward the request to your Express app
      app(req, res);
    })
    .catch(error => {
      console.error('Error loading server module:', error);
      res.status(500).send('Server error');
    });
}); 