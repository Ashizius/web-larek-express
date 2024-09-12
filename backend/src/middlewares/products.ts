import { celebrate, Joi, Segments } from 'celebrate';

const validationScheme = Joi.object({
  title: Joi.string().min(2).max(30).required(),
  image: Joi.object({
    fileName: Joi.string().required(),
    originalName: Joi.string().required(),
  }).required(),
  category: Joi.string().required(),
  description: Joi.string().optional(),
  price: Joi.number().optional(),
});

const idValidationScheme = Joi.object({
  _id: Joi.string().length(24).required(),
});

export const validateProductsId = celebrate({
  [Segments.BODY]: idValidationScheme,
});

export const validateProducts = celebrate({
  [Segments.BODY]: validationScheme,
});
