import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { getSampleUrl } from '../utils/config';

const QRCodeGenerator = ({ styleId, size = 200 }) => {
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const qrRef = useRef(null);
  
  // Use the configured URL for the sample detail page
  const sampleUrl = getSampleUrl(styleId);
  
  // Function to download QR code as PNG
  const downloadQRCode = () => {
    const canvas = document.createElement('canvas');
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `sample-${styleId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      
      setNotification({
        show: true,
        message: 'QR Code downloaded successfully',
        type: 'success'
      });
    };
    
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };
  
  // Function to print QR code
  const printQRCode = () => {
    const printWindow = window.open('', '_blank');
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code - ${styleId}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              padding: 20px;
              box-sizing: border-box;
              font-family: Arial, sans-serif;
            }
            .qr-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 8px;
            }
            .style-id {
              margin-top: 12px;
              font-size: 18px;
              font-weight: bold;
            }
            @media print {
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            ${svgData}
            <div class="style-id">Style ID: ${styleId}</div>
          </div>
          <p class="no-print" style="margin-top: 20px;">
            <button onclick="window.print();window.close();">Print</button>
          </p>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };
  
  // Function to copy sample URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(sampleUrl).then(
      () => {
        setNotification({
          show: true,
          message: 'URL copied to clipboard',
          type: 'success'
        });
      },
      (err) => {
        setNotification({
          show: true,
          message: 'Failed to copy URL',
          type: 'error'
        });
        console.error('Could not copy text: ', err);
      }
    );
  };
  
  // Close notification
  const hideNotification = () => {
    setNotification({ ...notification, show: false });
  };

  // Auto-hide notification after 3 seconds
  if (notification.show) {
    setTimeout(hideNotification, 3000);
  }
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
          QR Code
        </h3>
        
        <div className="flex justify-center p-4 bg-white border border-gray-100 rounded-lg" ref={qrRef}>
          <QRCodeSVG
            value={sampleUrl}
            size={size}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: '/logo.png',
              excavate: true,
              height: 24,
              width: 24,
            }}
          />
        </div>
        
        <p className="text-sm text-center text-gray-500 mt-3">
          Scan to view sample details
        </p>
      </div>
      
      <div className="px-4 pb-5 pt-2 flex flex-col gap-3">
        <button 
          onClick={downloadQRCode}
          className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <DownloadIcon fontSize="small" />
          <span className="font-medium">Download</span>
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={printQRCode}
            className="flex items-center justify-center gap-2 border border-gray-300 py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <PrintIcon fontSize="small" />
            <span className="font-medium">Print</span>
          </button>
          
          <button 
            onClick={copyToClipboard}
            className="flex items-center justify-center gap-2 border border-gray-300 py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ContentCopyIcon fontSize="small" />
            <span className="font-medium">Copy URL</span>
          </button>
        </div>
      </div>
      
      {/* Notification toast */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
          notification.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' : 
          'bg-red-50 text-red-800 border-l-4 border-red-500'
        } z-50 transition-all`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator; 