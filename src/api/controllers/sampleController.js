import { asyncHandler } from '../middleware/errorHandler.js';
import { ApiError } from '../middleware/errorHandler.js';
import * as sampleService from '../../services/sampleService.js';
import * as localStorageService from '../../services/localStorageService.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase.js';

// Collection name constant
const SAMPLES_COLLECTION = 'samples';

// Create a new sample
export const createSample = asyncHandler(async (req, res) => {
  try {
    const { style_id, ...sampleData } = req.body;
    
    console.log(`Creating sample with style_id: ${style_id}`);
    
    // Check if sample already exists
    const existingSample = await sampleService.getSampleById(style_id);
    if (existingSample) {
      throw new ApiError(`Sample with style_id ${style_id} already exists`, 409);
    }
    
    // Process image data if present
    if (sampleData.images && sampleData.images.length > 0) {
      console.log(`Processing ${sampleData.images.length} images`);
      
      // Ensure each image has the required properties
      sampleData.images = sampleData.images.filter(img => img && (img.preview || img.url));
      
      if (sampleData.images.length === 0) {
        console.log('No valid images after filtering');
      }
    }
    
    // Create sample
    const newSample = await sampleService.createSample(style_id, sampleData);
    
    res.status(201).json({
      success: true,
      data: newSample
    });
  } catch (error) {
    console.error('Error in createSample controller:', error);
    throw error;
  }
});

// Get a sample by style_id
export const getSampleById = asyncHandler(async (req, res) => {
  const { styleId } = req.params;
  
  // Get sample
  const sample = await sampleService.getSampleById(styleId);
  
  // Check if sample exists
  if (!sample) {
    throw new ApiError(`Sample with style_id ${styleId} not found`, 404);
  }
  
  res.status(200).json({
    success: true,
    data: sample
  });
});

// Get all samples
export const getAllSamples = asyncHandler(async (req, res) => {
  // Get all samples
  const samples = await sampleService.getAllSamples();
  
  res.status(200).json({
    success: true,
    count: samples.length,
    data: samples
  });
});

// Update a sample
export const updateSample = asyncHandler(async (req, res) => {
  const { styleId } = req.params;
  const updateData = req.body;
  
  // Check if sample exists
  const existingSample = await sampleService.getSampleById(styleId);
  if (!existingSample) {
    throw new ApiError(`Sample with style_id ${styleId} not found`, 404);
  }
  
  // Update sample
  await sampleService.updateSample(styleId, updateData);
  
  // Get updated sample
  const updatedSample = await sampleService.getSampleById(styleId);
  
  res.status(200).json({
    success: true,
    data: updatedSample
  });
});

// Delete a sample
export const deleteSample = asyncHandler(async (req, res) => {
  const { styleId } = req.params;
  
  // Check if sample exists
  const existingSample = await sampleService.getSampleById(styleId);
  if (!existingSample) {
    throw new ApiError(`Sample with style_id ${styleId} not found`, 404);
  }
  
  // Delete sample
  await sampleService.deleteSample(styleId);
  
  res.status(200).json({
    success: true,
    message: `Sample with style_id ${styleId} deleted successfully`
  });
});

// Add a simple sample with minimal validation
export const addSimpleSample = asyncHandler(async (req, res) => {
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
      price: price || null,
      quantity: quantity || null,
      colors: colors || null,
      fabric_weight: fabric_weight || null,
      fabric_comp: fabric_comp || null,
      created_at: new Date()
    };
    
    try {
      // Reference to the document with style_id as document ID
      const docRef = doc(db, SAMPLES_COLLECTION, style_id);
      
      // Check if sample already exists
      const existingSample = await getDoc(docRef);
      if (existingSample.exists()) {
        return res.status(409).json({
          success: false,
          message: `Sample with style_id ${style_id} already exists`
        });
      }
      
      // Store in Firestore
      await setDoc(docRef, sampleData);
      
      // Return success response
      return res.status(200).json({
        success: true,
        message: `Sample with style_id ${style_id} created successfully`,
        data: sampleData
      });
    } catch (firestoreError) {
      console.log('Firebase error, using local storage fallback:', firestoreError.message);
      
      // Use localStorageService as fallback
      const result = await localStorageService.createSample(style_id, sampleData);
      
      return res.status(200).json({
        success: true,
        message: `Sample with style_id ${style_id} created successfully (using local storage)`,
        data: result,
        storage: 'local'
      });
    }
    
  } catch (error) {
    console.error('Error adding simple sample:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}); 