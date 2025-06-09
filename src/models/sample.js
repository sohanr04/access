/**
 * Sample garment model
 * @typedef {Object} Sample
 * @property {string} style_id - Unique identifier for the garment style
 * @property {number} price - Price of the garment
 * @property {string[]} available_colors - Array of available colors
 * @property {number} quantity - Available quantity
 * @property {Date} created_at - Timestamp when the record was created
 * @property {Date} updated_at - Timestamp when the record was last updated
 */

// Sample structure (for reference)
const sampleStructure = {
  style_id: "ABC123",
  price: 29.99,
  available_colors: ["Red", "Blue", "Black"],
  quantity: 100,
  created_at: new Date(),
  updated_at: new Date()
};

export { sampleStructure }; 