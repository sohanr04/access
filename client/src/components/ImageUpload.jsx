import React, { useState, useRef } from 'react';
import { XMarkIcon, PhotoIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

const ImageUpload = ({ images = [], onChange, maxImages = 5 }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection from file dialog
  const handleFileSelect = (e) => {
    e.preventDefault();
    const files = e.target.files;
    if (files?.length) {
      processFiles(files);
    }
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files?.length) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Handle file drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Process selected files
  const processFiles = (files) => {
    setError(null);
    setUploading(true);
    
    // Check if adding more files would exceed the maximum
    if (images.length + files.length > maxImages) {
      setError(`You can only upload a maximum of ${maxImages} images`);
      setUploading(false);
      return;
    }
    
    // Validate file types and sizes
    const validFiles = [];
    const invalidFiles = [];
    
    Array.from(files).forEach(file => {
      // Check file type
      if (!file.type.match('image.*')) {
        invalidFiles.push(`${file.name} is not a valid image file`);
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name} exceeds 5MB size limit`);
        return;
      }
      
      validFiles.push(file);
    });
    
    if (invalidFiles.length > 0) {
      setError(invalidFiles.join(', '));
      setUploading(false);
      return;
    }
    
    // Simulate file upload with FileReader to get preview URLs
    const newImages = [...images];
    
    const promises = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          // Compress the image if it's too large
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // Scale down the image if it's too large
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1200;
            
            if (width > MAX_WIDTH) {
              height = Math.round(height * (MAX_WIDTH / width));
              width = MAX_WIDTH;
            }
            
            if (height > MAX_HEIGHT) {
              width = Math.round(width * (MAX_HEIGHT / height));
              height = MAX_HEIGHT;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Get compressed data URL
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            
            newImages.push({
              file,
              preview: dataUrl,
              name: file.name
            });
            resolve();
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(promises).then(() => {
      onChange(newImages);
      setUploading(false);
    });
  };

  // Handle removing an image
  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  // Open file dialog when the upload area is clicked
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product Images
      </label>
      
      {error && (
        <div className="mb-3 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
          {error}
        </div>
      )}
      
      {/* Image upload area */}
      <div
        className={`p-5 border-2 border-dashed rounded-lg flex flex-col items-center justify-center min-h-[160px] cursor-pointer transition-colors ${
          dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        
        <ArrowUpTrayIcon className="h-10 w-10 text-primary-500 mb-3" />
        <p className="text-base text-center mb-1">
          Drag & drop images here, or click to browse
        </p>
        <p className="text-sm text-gray-500 text-center">
          PNG, JPG, JPEG or GIF (max. {maxImages} images, 5MB each)
        </p>
        
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
            <div className="w-10 h-10 border-t-4 border-primary-500 border-solid rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {/* Image preview grid */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
            >
              <img
                src={image.preview}
                alt={image.name || `Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(index);
                }}
                className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
          
          {images.length < maxImages && (
            <div
              className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-gray-50 transition-colors"
              onClick={handleClick}
            >
              <PhotoIcon className="h-8 w-8 text-gray-400 mb-1" />
              <span className="text-sm text-gray-500">Add more</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 