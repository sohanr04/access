// In-memory storage for samples when Firebase is unavailable
let samplesStore = {};

/**
 * Create a new sample in the local store
 * @param {string} style_id - Unique identifier for the style
 * @param {Object} sampleData - Sample data without style_id
 * @returns {Promise<Object>} - Created sample data
 */
export const createSample = async (style_id, sampleData) => {
  try {
    console.log('Using local storage service to create sample');
    
    // Add timestamps
    const timestamp = new Date();
    const dataWithTimestamps = {
      ...sampleData,
      style_id,
      created_at: timestamp,
      updated_at: timestamp
    };
    
    // Store in memory
    samplesStore[style_id] = dataWithTimestamps;
    
    return dataWithTimestamps;
  } catch (error) {
    console.error('Error creating sample in local storage:', error);
    throw error;
  }
};

/**
 * Get a sample by style_id from local store
 * @param {string} style_id - Unique identifier for the style
 * @returns {Promise<Object|null>} - Sample data or null if not found
 */
export const getSampleById = async (style_id) => {
  try {
    console.log('Using local storage service to get sample');
    return samplesStore[style_id] || null;
  } catch (error) {
    console.error('Error getting sample from local storage:', error);
    throw error;
  }
};

/**
 * Update a sample in local store
 * @param {string} style_id - Unique identifier for the style
 * @param {Object} updateData - Data to update
 * @returns {Promise<boolean>} - Success status
 */
export const updateSample = async (style_id, updateData) => {
  try {
    console.log('Using local storage service to update sample');
    
    if (!samplesStore[style_id]) {
      throw new Error(`Sample with ID ${style_id} not found`);
    }
    
    // Update data with timestamp
    samplesStore[style_id] = {
      ...samplesStore[style_id],
      ...updateData,
      updated_at: new Date()
    };
    
    return true;
  } catch (error) {
    console.error('Error updating sample in local storage:', error);
    throw error;
  }
};

/**
 * Delete a sample from local store
 * @param {string} style_id - Unique identifier for the style
 * @returns {Promise<boolean>} - Success status
 */
export const deleteSample = async (style_id) => {
  try {
    console.log('Using local storage service to delete sample');
    
    if (samplesStore[style_id]) {
      delete samplesStore[style_id];
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting sample from local storage:', error);
    throw error;
  }
};

/**
 * Get all samples from local store
 * @returns {Promise<Array>} - Array of samples
 */
export const getAllSamples = async () => {
  try {
    console.log('Using local storage service to get all samples');
    return Object.values(samplesStore);
  } catch (error) {
    console.error('Error getting all samples from local storage:', error);
    throw error;
  }
}; 