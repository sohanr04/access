const testAPI = async () => {
  try {
    console.log('Testing API connection...');
    
    // Try different ports
    const ports = [3000, 3001, 3002, 3003];
    
    for (const port of ports) {
      try {
        const url = `http://localhost:${port}/api/health`;
        console.log(`Trying ${url}...`);
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log(`✅ API is running on port ${port}:`, data);
        return port;
      } catch (err) {
        console.log(`❌ API not available on port ${port}`);
      }
    }
    
    console.log('❌ Could not connect to API on any port');
    return null;
  } catch (error) {
    console.error('Error testing API:', error);
    return null;
  }
};

testAPI().then(port => {
  if (port) {
    console.log(`\n👉 Use this URL in your frontend proxy: http://localhost:${port}`);
  } else {
    console.log('\n❗ API server is not reachable. Make sure it is running.');
  }
}); 