import { 
  createSample, 
  getSampleById, 
  updateSample, 
  deleteSample, 
  getAllSamples,
  findSamplesByColor
} from './services/sampleService.js';

// Test sample data
const testSample = {
  price: 39.99,
  available_colors: ["Navy", "White", "Charcoal"],
  quantity: 50,
  packaging: {
    type: "Hanging Bag",
    dimensions: {
      length: 35,
      width: 25,
      height: 3
    },
    weight: 180
  }
};

// Test function to run CRUD operations
const runTest = async () => {
  const style_id = `TEST-${Date.now()}`;
  console.log(`Starting test with style_id: ${style_id}`);

  try {
    // Create a sample
    console.log('\n1. Creating a new sample:');
    const createdSample = await createSample(style_id, testSample);
    console.log('Sample created successfully:', createdSample);

    // Get the sample
    console.log('\n2. Retrieving the sample:');
    const retrievedSample = await getSampleById(style_id);
    console.log('Sample retrieved:', retrievedSample);

    // Update the sample
    console.log('\n3. Updating the sample:');
    const updateData = {
      price: 42.99,
      quantity: 75,
      available_colors: [...testSample.available_colors, "Grey"]
    };
    await updateSample(style_id, updateData);
    console.log('Sample updated successfully');

    // Get the updated sample
    console.log('\n4. Retrieving the updated sample:');
    const updatedSample = await getSampleById(style_id);
    console.log('Updated sample:', updatedSample);

    // Find samples by color
    console.log('\n5. Finding samples with color "White":');
    const samplesWithWhite = await findSamplesByColor('White');
    console.log(`Found ${samplesWithWhite.length} samples with White color:`, samplesWithWhite);

    // Get all samples
    console.log('\n6. Getting all samples:');
    const allSamples = await getAllSamples();
    console.log(`Found ${allSamples.length} total samples`);

    // Delete the sample
    console.log('\n7. Deleting the sample:');
    await deleteSample(style_id);
    console.log('Sample deleted successfully');

    // Verify deletion
    console.log('\n8. Verifying deletion:');
    const deletedSample = await getSampleById(style_id);
    console.log('Deleted sample lookup result:', deletedSample);

  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
runTest()
  .then(() => console.log('\nTest completed'))
  .catch(error => console.error('Error in test execution:', error)); 