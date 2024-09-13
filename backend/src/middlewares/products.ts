import { celebrate, Joi, Segments } from 'celebrate';

const joiCondition = { is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required() }

const validationScheme = Joi.object({
  _id: Joi.string().length(24).optional(),
  title: Joi.string().min(2).max(30).when('_id', joiCondition),
  image: Joi.object({
    fileName: Joi.string().required(),
    originalName: Joi.string().required(),
  }).when('_id', joiCondition),
  category: Joi.string().when('_id', joiCondition),
  description: Joi.string().optional(),
  price: Joi.number().optional(),
});
/*
const idValidationScheme = Joi.object({productsValidation, ...
  ,
});

export const validateProductsId = celebrate({
  [Segments.BODY]: idValidationScheme,
});*/

export const validateProducts = celebrate({
  [Segments.BODY]: validationScheme,
});
