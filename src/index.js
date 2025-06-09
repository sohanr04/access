import { db } from './config/firebase.js';
import { sampleStructure } from './models/sample.js';
import * as sampleService from './services/sampleService.js';

console.log('Garment Samples Database');
console.log('------------------------');
console.log('This is the main entry point for the application.');
console.log('You can extend this file to create a REST API or other interfaces.');
console.log('\nSample Structure:');
console.log(JSON.stringify(sampleStructure, null, 2));

console.log('\nTo test the database operations, run:');
console.log('npm test');

// Export services for use in other applications
export { sampleService }; 