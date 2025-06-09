/**
 * Test script for adding a simple sample with minimal validation
 */

const testSimpleSample = async () => {
  try {
    console.log('Testing simple sample creation API...');
    
    // Generate a unique style_id
    const style_id = `simple-${Date.now()}`;
    
    // Sample test data with only style_id as required
    const testSample = {
      style_id,
      price: 29.99,  // Optional - can be omitted or null
      quantity: 100, // Optional - can be omitted or null
      colors: "Red, Blue, Black", // Optional - can be omitted or null
      fabric_weight: "180 GSM", // Optional - can be omitted or null
      fabric_comp: "100% Cotton" // Optional - can be omitted or null
    };
    
    // Test sample without some fields
    const minimalSample = {
      style_id: `minimal-${Date.now()}`
      // All other fields omitted
    };
    
    // Try different ports
    const ports = [3000, 3001, 3002, 3003];
    
    // Test with full sample
    let fullSampleResult = null;
    for (const port of ports) {
      try {
        const url = `http://localhost:${port}/api/samples/simple`;
        console.log(`Trying to create full sample at ${url}...`);
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testSample),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          console.log(`✅ Full sample created successfully on port ${port}:`, data);
          fullSampleResult = { port, success: true, data };
          break;
        } else {
          console.log(`❌ Failed to create full sample on port ${port}:`, data);
        }
      } catch (err) {
        console.log(`❌ API not available on port ${port}:`, err.message);
      }
    }
    
    // Test with minimal sample
    let minimalSampleResult = null;
    if (fullSampleResult) {
      const port = fullSampleResult.port;
      try {
        const url = `http://localhost:${port}/api/samples/simple`;
        console.log(`Trying to create minimal sample at ${url}...`);
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(minimalSample),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          console.log(`✅ Minimal sample created successfully:`, data);
          minimalSampleResult = { success: true, data };
        } else {
          console.log(`❌ Failed to create minimal sample:`, data);
        }
      } catch (err) {
        console.log(`❌ Error creating minimal sample:`, err.message);
      }
    }
    
    // Test with missing style_id (should fail)
    if (fullSampleResult) {
      const port = fullSampleResult.port;
      try {
        const url = `http://localhost:${port}/api/samples/simple`;
        console.log(`Testing error handling - missing style_id at ${url}...`);
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}), // Empty object, missing style_id
        });
        
        const data = await response.json();
        
        if (!response.ok && response.status === 400) {
          console.log(`✅ Correctly rejected sample without style_id:`, data);
        } else {
          console.log(`❌ Unexpected response for missing style_id:`, data);
        }
      } catch (err) {
        console.log(`❌ Error testing missing style_id:`, err.message);
      }
    }
    
    return { 
      fullSample: fullSampleResult, 
      minimalSample: minimalSampleResult
    };
  } catch (error) {
    console.error('Error testing simple sample creation:', error);
    return { success: false, error };
  }
};

// Run the test
testSimpleSample().then(() => {
  console.log('Test completed');
}); 