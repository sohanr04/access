import { db, storage } from '../config/firebase.js';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import * as localStorageService from './localStorageService.js';

// Flag to track if Firebase is offline
let isFirebaseOffline = false;

// Collection reference
const SAMPLES_COLLECTION = 'samples';
const samplesRef = collection(db, SAMPLES_COLLECTION);

/**
 * Check if Firebase is offline and log the error
 * @param {Error} error - The error to check
 * @returns {boolean} - True if Firebase is offline
 */
const checkIfFirebaseOffline = (error) => {
  const isOffline = 
    error.message?.includes('offline') || 
    error.message?.includes('network error') ||
    error.code === 'unavailable';
  
  if (isOffline && !isFirebaseOffline) {
    console.warn('Firebase is offline, using local storage fallback');
    isFirebaseOffline = true;
  }
  
  return isOffline;
};

/**
 * Upload sample images to Firebase Storage
 * @param {string} style_id - Unique identifier for the style
 * @param {Array} images - Array of image files
 * @returns {Promise<Array>} - Array of image URLs and metadata
 */
export const uploadSampleImages = async (style_id, images) => {
  try {
    const imagePromises = images.map(async (image, index) => {
      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, `samples/${style_id}/${index}_${image.name}`);
      
      // Convert base64 to blob
      const base64Response = await fetch(image.preview);
      const blob = await base64Response.blob();
      
      // Upload the file
      const uploadTask = await uploadBytesResumable(storageRef, blob);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(uploadTask.ref);
      
      return {
        url: downloadURL,
        name: image.name,
        path: uploadTask.ref.fullPath,
        size: uploadTask.totalBytes,
        contentType: image.file.type,
      };
    });
    
    return Promise.all(imagePromises);
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};

/**
 * Delete sample images from Firebase Storage
 * @param {Array} imagePaths - Array of image paths to delete
 * @returns {Promise<void>}
 */
export const deleteSampleImages = async (imagePaths) => {
  try {
    const deletePromises = imagePaths.map(async (path) => {
      const imageRef = ref(storage, path);
      return deleteObject(imageRef);
    });
    
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting images:', error);
    throw error;
  }
};

/**
 * Create a new sample in the database
 * @param {string} style_id - Unique identifier for the style
 * @param {Object} sampleData - Sample data without style_id
 * @returns {Promise<Object>} - Created sample data
 */
export const createSample = async (style_id, sampleData) => {
  try {
    console.log('sampleService.createSample called with:', { style_id, sampleData });
    
    // Validate required data
    if (!style_id) {
      throw new Error('Style ID is required');
    }
    
    const docRef = doc(db, SAMPLES_COLLECTION, style_id);
    
    // Handle image uploads if present
    let processedImages = [];
    if (sampleData.images && sampleData.images.length > 0) {
      processedImages = await uploadSampleImages(style_id, sampleData.images);
    }
    
    // Add timestamps and processed images
    const dataWithTimestamps = {
      ...sampleData,
      style_id,
      images: processedImages,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };
    
    // Set a timeout for the Firebase operation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Firestore operation timed out')), 10000);
    });
    
    // Try to set the document with a timeout
    try {
      await Promise.race([
        setDoc(docRef, dataWithTimestamps),
        timeoutPromise
      ]);
    } catch (timeoutError) {
      console.warn('Firestore operation timed out or failed, using local storage fallback');
      return localStorageService.createSample(style_id, sampleData);
    }
    
    console.log('Sample created in Firestore:', style_id);
    
    // Return the created sample (with local timestamps for immediate use)
    return {
      ...dataWithTimestamps,
      created_at: new Date(),
      updated_at: new Date()
    };
  } catch (error) {
    console.error('Error creating sample in Firebase:', error);
    
    // If Firebase is offline, use local storage
    if (checkIfFirebaseOffline(error)) {
      console.log('Firebase is offline, using local storage fallback');
      return localStorageService.createSample(style_id, sampleData);
    }
    
    throw error;
  }
};

/**
 * Get a sample by style_id
 * @param {string} style_id - Unique identifier for the style
 * @returns {Promise<Object|null>} - Sample data or null if not found
 */
export const getSampleById = async (style_id) => {
  try {
    const docRef = doc(db, SAMPLES_COLLECTION, style_id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting sample from Firebase:', error);
    
    // If Firebase is offline, use local storage
    if (checkIfFirebaseOffline(error)) {
      return localStorageService.getSampleById(style_id);
    }
    
    throw error;
  }
};

/**
 * Update a sample
 * @param {string} style_id - Unique identifier for the style
 * @param {Object} updateData - Data to update
 * @returns {Promise<boolean>} - Success status
 */
export const updateSample = async (style_id, updateData) => {
  try {
    const docRef = doc(db, SAMPLES_COLLECTION, style_id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error(`Sample with ID ${style_id} not found`);
    }
    
    const currentData = docSnap.data();
    
    // Handle image updates if present
    if (updateData.images) {
      // Get new images that need to be uploaded (those with preview property)
      const newImages = updateData.images.filter(img => img.preview);
      
      // Get existing images that should be kept
      const existingImages = updateData.images.filter(img => !img.preview);
      
      // Get images that need to be deleted
      const imagesToDelete = currentData.images?.filter(img => 
        !existingImages.some(existing => existing.path === img.path)
      );
      
      // Delete removed images
      if (imagesToDelete && imagesToDelete.length > 0) {
        const pathsToDelete = imagesToDelete.map(img => img.path);
        await deleteSampleImages(pathsToDelete);
      }
      
      // Upload new images
      let processedNewImages = [];
      if (newImages.length > 0) {
        processedNewImages = await uploadSampleImages(style_id, newImages);
      }
      
      // Combine existing and new images
      updateData.images = [...existingImages, ...processedNewImages];
    }
    
    // Add updated timestamp
    const dataWithTimestamp = {
      ...updateData,
      updated_at: serverTimestamp()
    };
    
    await updateDoc(docRef, dataWithTimestamp);
    return true;
  } catch (error) {
    console.error('Error updating sample in Firebase:', error);
    
    // If Firebase is offline, use local storage
    if (checkIfFirebaseOffline(error)) {
      return localStorageService.updateSample(style_id, updateData);
    }
    
    throw error;
  }
};

/**
 * Delete a sample
 * @param {string} style_id - Unique identifier for the style
 * @returns {Promise<boolean>} - Success status
 */
export const deleteSample = async (style_id) => {
  try {
    const docRef = doc(db, SAMPLES_COLLECTION, style_id);
    const docSnap = await getDoc(docRef);
    
    // Delete associated images if they exist
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.images && data.images.length > 0) {
        const pathsToDelete = data.images.map(img => img.path);
        await deleteSampleImages(pathsToDelete);
      }
    }
    
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting sample from Firebase:', error);
    
    // If Firebase is offline, use local storage
    if (checkIfFirebaseOffline(error)) {
      return localStorageService.deleteSample(style_id);
    }
    
    throw error;
  }
};

/**
 * Get all samples
 * @returns {Promise<Array>} - Array of samples
 */
export const getAllSamples = async () => {
  try {
    const querySnapshot = await getDocs(samplesRef);
    const samples = [];
    
    querySnapshot.forEach((doc) => {
      samples.push({ id: doc.id, ...doc.data() });
    });
    
    return samples;
  } catch (error) {
    console.error('Error getting all samples from Firebase:', error);
    
    // If Firebase is offline, use local storage
    if (checkIfFirebaseOffline(error)) {
      return localStorageService.getAllSamples();
    }
    
    throw error;
  }
};

/**
 * Find samples by color
 * @param {string} color - Color to search for
 * @returns {Promise<Array>} - Array of matching samples
 */
export const findSamplesByColor = async (color) => {
  try {
    const q = query(samplesRef, where('available_colors', 'array-contains', color));
    const querySnapshot = await getDocs(q);
    const samples = [];
    
    querySnapshot.forEach((doc) => {
      samples.push({ id: doc.id, ...doc.data() });
    });
    
    return samples;
  } catch (error) {
    console.error('Error finding samples by color:', error);
    throw error;
  }
}; 