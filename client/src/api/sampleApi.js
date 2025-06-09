import axios from 'axios';

// Get API URL from environment or use default
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API endpoints for samples
const sampleApi = {
  // Get all samples
  getAllSamples: async () => {
    try {
      const response = await api.get('/samples');
      return response.data;
    } catch (error) {
      console.error('Error fetching samples:', error);
      throw error;
    }
  },

  // Get sample by ID
  getSampleById: async (styleId) => {
    try {
      const response = await api.get(`/samples/${styleId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sample ${styleId}:`, error);
      throw error;
    }
  },

  // Create new sample
  createSample: async (sampleData) => {
    try {
      console.log('Sending sample data:', JSON.stringify(sampleData));
      
      // Create a deep copy to avoid modifying the original data
      const dataToSend = JSON.parse(JSON.stringify(sampleData));
      
      // Convert all numeric values to ensure they're numbers, not strings
      if (typeof dataToSend.price !== 'number') dataToSend.price = Number(dataToSend.price) || 0.01;
      if (typeof dataToSend.quantity !== 'number') dataToSend.quantity = Number(dataToSend.quantity) || 0;
      
      // If there are images, process them to avoid circular JSON references
      if (dataToSend.images && dataToSend.images.length > 0) {
        dataToSend.images = dataToSend.images.map(image => ({
          name: image.name,
          preview: image.preview,
          // Don't include the file object directly
        }));
      }
      
      console.log('After conversion:', JSON.stringify(dataToSend));
      
      // Set a timeout to prevent the request from hanging indefinitely
      const timeoutId = setTimeout(() => {
        console.error('API request timeout after 30 seconds');
        throw new Error('Request timeout - server took too long to respond');
      }, 30000);
      
      try {
        const response = await api.post('/samples', dataToSend);
        clearTimeout(timeoutId);
        return response.data;
      } catch (apiError) {
        clearTimeout(timeoutId);
        console.error('API error details:', apiError);
        
        // Enhance error information
        if (apiError.response) {
          console.error('Response status:', apiError.response.status);
          console.error('Response data:', apiError.response.data);
        }
        
        throw apiError;
      }
    } catch (error) {
      console.error('Error creating sample:', error);
      throw error;
    }
  },

  // Update sample
  updateSample: async (styleId, updateData) => {
    try {
      const response = await api.put(`/samples/${styleId}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating sample ${styleId}:`, error);
      throw error;
    }
  },

  // Delete sample
  deleteSample: async (styleId) => {
    try {
      const response = await api.delete(`/samples/${styleId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting sample ${styleId}:`, error);
      throw error;
    }
  },
};

export default sampleApi; 