const testCreateSample = async () => {
  try {
    console.log('Testing sample creation API...');
    
    // Sample test data
    const testSample = {
      style_id: `test-${Date.now()}`,
      price: 29.99,
      quantity: 100,
      available_colors: ["Red", "Blue", "Black"],
      packaging: {
        type: "Box",
        dimensions: {
          length: 20,
          width: 15,
          height: 5
        },
        weight: 250
      },
      images: [] // No images for this test
    };
    
    // Try different ports
    const ports = [3000, 3001, 3002, 3003];
    
    for (const port of ports) {
      try {
        const url = `http://localhost:${port}/api/samples`;
        console.log(`Trying to create sample at ${url}...`);
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testSample),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          console.log(`✅ Sample created successfully on port ${port}:`, data);
          return { port, success: true, data };
        } else {
          console.log(`❌ Failed to create sample on port ${port}:`, data);
          return { port, success: false, error: data };
        }
      } catch (err) {
        console.log(`❌ API not available on port ${port}:`, err.message);
      }
    }
    
    console.log('❌ Could not create sample on any port');
    return { success: false };
  } catch (error) {
    console.error('Error testing sample creation:', error);
    return { success: false, error };
  }
};

testCreateSample().then(result => {
  if (result.success) {
    console.log(`\n👉 Sample creation successful. Use port ${result.port} in your frontend proxy.`);
  } else {
    console.log('\n❗ Sample creation failed. Check the API server logs for details.');
  }
}); 