import express from 'express';
import { 
  createSample, 
  getSampleById, 
  getAllSamples, 
  updateSample, 
  deleteSample,
  addSimpleSample 
} from '../controllers/sampleController.js';
import { validateRequest, createSampleSchema, getSampleSchema } from '../validators/sampleValidator.js';

const router = express.Router();

// Routes
router.route('/')
  .get(getAllSamples)
  .post(validateRequest(createSampleSchema, 'body'), createSample);

// Simple sample creation with minimal validation
router.route('/simple')
  .post(addSimpleSample);

router.route('/:styleId')
  .get(validateRequest(getSampleSchema, 'params'), getSampleById)
  .put(validateRequest(getSampleSchema, 'params'), updateSample)
  .delete(validateRequest(getSampleSchema, 'params'), deleteSample);

export default router; 