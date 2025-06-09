import React, { useState } from 'react';
import { useRouter } from 'next/router';
import SampleForm from '../components/SampleForm';
import QRCodeGenerator from '../components/QRCodeGenerator';
import sampleApi from '../api/sampleApi';

const CreateSample = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createdSample, setCreatedSample] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Ensure style_id is present
      if (!formData.style_id) {
        setError('Style ID is required');
        setLoading(false);
        return;
      }
      
      try {
        const response = await sampleApi.createSample(formData);
        
        if (response.success) {
          setCreatedSample(response.data);
        } else {
          setError(response.message || 'Failed to create sample. Please try again.');
        }
      } catch (err) {
        if (err.message && err.message.includes('timeout')) {
          setError('Request timed out. The server took too long to respond. Please try again.');
        } else if (err.response) {
          setError(`Server error: ${err.response.data?.message || err.response.statusText || 'Unknown error'}`);
        } else if (err.request) {
          setError('No response from server. Please check your connection and try again.');
        } else {
          setError(`An unexpected error occurred: ${err.message}`);
        }
      }
    } catch (outerErr) {
      setError(`An unexpected error occurred: ${outerErr.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setError(null);
  };

  const handleCreateAnother = () => {
    setCreatedSample(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Add New Sample
      </h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
          <div className="flex justify-between">
            <div>
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
            <button 
              onClick={handleTryAgain} 
              className="text-sm font-medium text-red-700 hover:text-red-900"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {createdSample ? (
        <div>
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
            <h3 className="text-green-800 font-medium">Success</h3>
            <p className="text-green-700 mt-1">
              Sample {createdSample.style_id} has been created successfully!
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Generated QR Code
            </h2>
            <p className="text-gray-600 mb-6">
              The QR code below can be used to access the sample information. You can download or print it for attaching to the physical sample.
            </p>
            
            <div className="p-4 mb-6 bg-blue-50 border-l-4 border-blue-500 rounded-md">
              <h3 className="text-blue-800 font-medium">Important</h3>
              <p className="text-blue-700 mt-1">
                For production use, please update the <code className="bg-blue-100 px-1 rounded">PRODUCTION_URL</code> in <code className="bg-blue-100 px-1 rounded">src/utils/config.js</code> to your actual domain.
              </p>
              <p className="text-blue-700 mt-2">
                Current QR code links to: {window.location.origin}/samples/{createdSample.style_id}
              </p>
            </div>
            
            <div className="max-w-xs mx-auto">
              <QRCodeGenerator styleId={createdSample.style_id} />
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={handleCreateAnother}
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              Create Another Sample
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <SampleForm onSubmit={handleSubmit} />
          
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10 rounded-xl">
              <div className="w-16 h-16 border-t-4 border-primary-500 border-solid rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateSample; 