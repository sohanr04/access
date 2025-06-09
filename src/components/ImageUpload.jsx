import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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
          newImages.push({
            file,
            preview: e.target.result,
            name: file.name
          });
          resolve();
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
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Product Images
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Image upload area */}
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          backgroundColor: dragActive ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
          border: dragActive ? '2px dashed #1976d2' : '2px dashed #ccc',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 150,
          cursor: 'pointer',
          transition: 'all 0.3s',
          position: 'relative',
          mb: 3,
        }}
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
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="body1" align="center" sx={{ mb: 1 }}>
          Drag & drop images here, or click to browse
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          PNG, JPG, JPEG or GIF (max. {maxImages} images, 5MB each)
        </Typography>
        
        {uploading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Paper>
      
      {/* Image preview grid */}
      {images.length > 0 && (
        <Grid container spacing={2}>
          {images.map((image, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Paper
                sx={{
                  p: 1,
                  position: 'relative',
                  overflow: 'hidden',
                  aspectRatio: '1/1',
                }}
              >
                <Box
                  component="img"
                  src={image.preview}
                  alt={image.name || `Image ${index + 1}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 1,
                  }}
                />
                <IconButton
                  size="small"
                  color="error"
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(index);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Paper>
            </Grid>
          ))}
          
          {images.length < maxImages && (
            <Grid item xs={6} sm={4} md={3}>
              <Paper
                sx={{
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  aspectRatio: '1/1',
                  border: '2px dashed #ccc',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  },
                }}
                onClick={handleClick}
              >
                <AddPhotoAlternateIcon sx={{ fontSize: 36, color: 'primary.main', mb: 1 }} />
                <Typography variant="body2" align="center">
                  Add more
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default ImageUpload; 