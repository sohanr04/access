import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import QRCodeGenerator from '../../components/QRCodeGenerator';
import sampleApi from '../../api/sampleApi';

const ViewSample = () => {
  const router = useRouter();
  const [sample, setSample] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchSample = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await sampleApi.getSampleById(router.query.styleId);
        
        if (response.success) {
          setSample(response.data);
        } else {
          setError('Failed to load sample data');
        }
      } catch (err) {
        console.error(`Error fetching sample ${router.query.styleId}:`, err);
        if (err.response?.status === 404) {
          setError(`Sample with ID ${router.query.styleId} not found`);
        } else {
          setError('An error occurred while fetching the sample');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchSample();
  }, [router.query.styleId]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete sample ${router.query.styleId}?`)) {
      try {
        setLoading(true);
        await sampleApi.deleteSample(router.query.styleId);
        router.push('/samples', { state: { message: `Sample ${router.query.styleId} deleted successfully` } });
      } catch (err) {
        console.error(`Error deleting sample ${router.query.styleId}:`, err);
        setError('Failed to delete the sample');
        setLoading(false);
      }
    }
  };

  // Open image modal
  const handleOpenImage = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  // Close image modal
  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-primary-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link 
          href="/samples" 
          className="inline-flex items-center text-lg font-medium text-primary-600 hover:text-primary-800"
        >
          <ArrowBackIcon className="mr-2" />
          Back to Samples
        </Link>
        
        <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="text-red-700 font-bold">Error</div>
          <div className="text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  // Helper function to check if a value exists and is not empty
  const hasValue = (value) => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pb-16">
      {/* Back button and actions */}
      <div className="flex justify-between items-center py-4">
        <Link 
          href="/samples" 
          className="inline-flex items-center text-lg font-medium text-gray-700 hover:text-primary-600"
        >
          <ArrowBackIcon className="mr-1" />
          <span className="hidden sm:inline">Back</span>
        </Link>
        
        <button
          onClick={handleDelete}
          className="inline-flex items-center px-3 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
        >
          <DeleteIcon className="mr-1" />
          <span className="text-sm">Delete</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main content */}
        <div className="lg:col-span-8">
          {/* Style ID header */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {sample.style_id}
          </h1>
          
          {/* Product Images */}
          {hasValue(sample.images) && (
            <div className="mb-8">
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden mb-2">
                {sample.images.length > 0 && (
                  <img
                    src={sample.images[currentImageIndex].preview}
                    alt={`${sample.style_id} - View ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    onClick={() => handleOpenImage(sample.images[currentImageIndex], currentImageIndex)}
                  />
                )}
              </div>
              
              {/* Thumbnail grid */}
              {sample.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {sample.images.map((image, index) => (
                    <button
                      key={index}
                      className={`aspect-square rounded-md overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-primary-500' : 'border-transparent'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img
                        src={image.preview}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Price and essential details */}
          <div className="space-y-6">
            {/* Price & Quantity row */}
            <div className="grid grid-cols-2 gap-4">
              {hasValue(sample.price) && (
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    ${sample.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">Price</p>
                </div>
              )}
              
              {hasValue(sample.quantity) && (
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {sample.quantity}
                  </p>
                  <p className="text-sm text-gray-500">Quantity</p>
                </div>
              )}
            </div>
            
            {/* Available Colors */}
            {hasValue(sample.available_colors) && (
              <div className="py-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Available Colors</p>
                <div className="flex flex-wrap gap-2">
                  {sample.available_colors.map((color) => (
                    <span
                      key={color}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Fabric details */}
            <div className="py-4 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Fabric Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                {hasValue(sample.fabric_weight) && (
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="text-base font-medium">{sample.fabric_weight} g/m²</p>
                  </div>
                )}
                
                {hasValue(sample.fabric_composition) && (
                  <div>
                    <p className="text-sm text-gray-500">Composition</p>
                    <p className="text-base font-medium">{sample.fabric_composition}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Date information */}
            <div className="py-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Created</p>
                  <p>{new Date(sample.created_at?.seconds ? sample.created_at.seconds * 1000 : sample.created_at).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <p className="text-gray-500">Updated</p>
                  <p>{new Date(sample.updated_at?.seconds ? sample.updated_at.seconds * 1000 : sample.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* QR Code section */}
        <div className="lg:col-span-4">
          <div className="sticky top-4">
            <QRCodeGenerator styleId={sample.style_id} />
          </div>
        </div>
      </div>

      {/* Image modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center" onClick={handleCloseImage}>
          <button 
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70"
            onClick={handleCloseImage}
          >
            <CloseIcon />
          </button>
          
          <img
            src={selectedImage.preview}
            alt={selectedImage.name || `${sample.style_id} image`}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ViewSample; 