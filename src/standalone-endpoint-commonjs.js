const express = require('express');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');

// Initialize Express app
const app = express();
app.use(express.json());

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'your-api-key',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'your-auth-domain',
  projectId: process.env.FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'your-storage-bucket',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'your-messaging-sender-id',
  appId: process.env.FIREBASE_APP_ID || 'your-app-id'
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Collection name
const SAMPLES_COLLECTION = 'samples';

// Add sample endpoint
app.post('/api/samples', async (req, res) => {
  try {
    const { 
      style_id, 
      price, 
      quantity, 
      colors, 
      fabric_weight, 
      fabric_comp 
    } = req.body;
    
    // Check if style_id is provided
    if (!style_id) {
      return res.status(400).json({
        success: false,
        message: 'style_id is required'
      });
    }
    
    // Prepare data for Firestore
    const sampleData = {
      style_id,
      price: price !== undefined ? price : null,
      quantity: quantity !== undefined ? quantity : null,
      colors: colors || null,
      fabric_weight: fabric_weight || null,
      fabric_comp: fabric_comp || null,
      created_at: new Date()
    };
    
    // Reference to the document with style_id as document ID
    const docRef = doc(db, SAMPLES_COLLECTION, style_id);
    
    // Check if sample already exists (optional)
    try {
      const existingSample = await getDoc(docRef);
      if (existingSample.exists()) {
        return res.status(409).json({
          success: false,
          message: `Sample with style_id ${style_id} already exists`
        });
      }
    } catch (error) {
      console.warn('Error checking existing sample:', error);
      // Continue with adding the sample even if check fails
    }
    
    // Store in Firestore
    await setDoc(docRef, sampleData);
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: `Sample with style_id ${style_id} created successfully`,
      data: sampleData
    });
    
  } catch (error) {
    console.error('Error adding sample:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Sample API available at http://localhost:${PORT}/api/samples`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Server shutting down...');
  process.exit(0);
});

module.exports = app; 