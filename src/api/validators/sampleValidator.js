import Joi from 'joi';

// Create sample validation schema
export const createSampleSchema = Joi.object({
  style_id: Joi.string().required().trim(),
  price: Joi.number().required().positive(),
  available_colors: Joi.array().items(Joi.string().trim()).min(1).required(),
  quantity: Joi.number().integer().min(0).required(),
  images: Joi.array().items(
    Joi.object({
      name: Joi.string().allow(''),
      preview: Joi.string().allow(''),
      url: Joi.string().allow(''),
      path: Joi.string().allow(''),
      size: Joi.number().allow(null),
      contentType: Joi.string().allow('')
    })
  ).optional()
});

// Get sample validation schema (for path params)
export const getSampleSchema = Joi.object({
  styleId: Joi.string().required().trim()
});

// Validate request middleware
export const validateRequest = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { 
      stripUnknown: true, // Remove unknown fields
      abortEarly: false   // Return all errors
    });
    
    if (error) {
      const { details } = error;
      const message = details.map(i => i.message).join(',');
      
      return res.status(400).json({ 
        error: true, 
        message: message
      });
    }
    
    next();
  };
}; 