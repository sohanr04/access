import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import ImageUpload from './ImageUpload';

const SampleForm = ({ onSubmit, initialData = {}, isEditing = false }) => {
  const [formData, setFormData] = useState({
    style_id: initialData.style_id || '',
    price: initialData.price || '',
    quantity: initialData.quantity || '',
    available_colors: initialData.available_colors || [],
    fabric_weight: initialData.fabric_weight || '',
    fabric_composition: initialData.fabric_composition || '',
    images: initialData.images || [],
  });

  const [colorInput, setColorInput] = useState('');
  const [errors, setErrors] = useState({});
  const [additionalInfoOpen, setAdditionalInfoOpen] = useState(false);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Handle number input change (only numbers allowed)
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    // Convert to number immediately, or empty string if empty
    const numericValue = value === '' ? '' : Number(value);
    
    // Only update if it's a valid number or empty string
    if (value === '' || !isNaN(numericValue)) {
      handleChange({
        target: {
          name,
          value: numericValue,
        },
      });
    }
  };

  // Handle images change from ImageUpload component
  const handleImagesChange = (images) => {
    setFormData({
      ...formData,
      images,
    });
  };

  // Add a color to the available colors array
  const handleAddColor = () => {
    if (colorInput.trim() && !formData.available_colors.includes(colorInput.trim())) {
      setFormData({
        ...formData,
        available_colors: [...formData.available_colors, colorInput.trim()],
      });
      setColorInput('');
    }
  };

  // Remove a color from the available colors array
  const handleDeleteColor = (colorToDelete) => {
    setFormData({
      ...formData,
      available_colors: formData.available_colors.filter(color => color !== colorToDelete),
    });
  };

  // Handle color input keypress (add on Enter)
  const handleColorKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddColor();
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.style_id.trim()) {
      newErrors.style_id = 'Style ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submissionData = {
        ...formData,
        price: formData.price === '' ? '' : Number(formData.price),
        quantity: formData.quantity === '' ? '' : Number(formData.quantity),
        fabric_weight: formData.fabric_weight === '' ? '' : Number(formData.fabric_weight),
        // Process images more efficiently
        images: formData.images.map(({ name = '', preview = '' }) => ({ name, preview }))
      };
      
      onSubmit(submissionData);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditing ? 'Edit Sample' : 'Add New Sample'}
        </h2>
        
        {/* Style ID - Required Field */}
        <div className="mb-6">
          <label htmlFor="style_id" className="block text-sm font-medium text-gray-700 mb-1">
            Style ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="style_id"
            name="style_id"
            value={formData.style_id}
            onChange={handleChange}
            disabled={isEditing}
            className={`w-full px-4 py-3 text-lg rounded-lg border ${
              errors.style_id 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
            } focus:outline-none focus:ring-2`}
            placeholder="Enter unique style identifier"
          />
          {errors.style_id && (
            <p className="mt-1 text-sm text-red-600">{errors.style_id}</p>
          )}
        </div>
        
        {/* Additional Information Section */}
        <div className="mb-6">
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 text-lg font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            onClick={() => setAdditionalInfoOpen(!additionalInfoOpen)}
          >
            <span>Additional Information</span>
            {additionalInfoOpen ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
          
          {additionalInfoOpen && (
            <div className="mt-4 space-y-6 px-1 pt-2">
              {/* Price & Quantity Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleNumberChange}
                      className="w-full pl-8 pr-4 py-3 text-lg rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 focus:outline-none focus:ring-2"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
                
                {/* Quantity */}
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleNumberChange}
                    className="w-full px-4 py-3 text-lg rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 focus:outline-none focus:ring-2"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              
              {/* Available Colors */}
              <div>
                <label htmlFor="colorInput" className="block text-sm font-medium text-gray-700 mb-1">
                  Available Colors
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="colorInput"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyPress={handleColorKeyPress}
                    className="flex-1 px-4 py-3 text-lg rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 focus:outline-none focus:ring-2"
                    placeholder="Add a color (e.g., Red, Blue, Black)"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>
                
                {formData.available_colors.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {formData.available_colors.map((color) => (
                        <span
                          key={color}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                        >
                          {color}
                          <button
                            type="button"
                            onClick={() => handleDeleteColor(color)}
                            className="ml-1.5 text-gray-500 hover:text-gray-700 focus:outline-none"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Fabric Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fabric Weight */}
                <div>
                  <label htmlFor="fabric_weight" className="block text-sm font-medium text-gray-700 mb-1">
                    Fabric Weight
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="fabric_weight"
                      name="fabric_weight"
                      value={formData.fabric_weight}
                      onChange={handleNumberChange}
                      className="w-full px-4 py-3 text-lg rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 focus:outline-none focus:ring-2"
                      placeholder="0"
                      min="0"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500">g/m²</span>
                    </div>
                  </div>
                </div>
                
                {/* Fabric Composition */}
                <div>
                  <label htmlFor="fabric_composition" className="block text-sm font-medium text-gray-700 mb-1">
                    Fabric Composition
                  </label>
                  <input
                    type="text"
                    id="fabric_composition"
                    name="fabric_composition"
                    value={formData.fabric_composition}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-lg rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 focus:outline-none focus:ring-2"
                    placeholder="e.g., 100% Cotton"
                  />
                </div>
              </div>
              
              {/* Image Upload */}
              <div className="mt-8">
                <ImageUpload
                  images={formData.images}
                  onChange={handleImagesChange}
                  maxImages={5}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            className="w-full py-4 px-6 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            Create Sample
          </button>
        </div>
      </form>
    </div>
  );
};

export default SampleForm; 