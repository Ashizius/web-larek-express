import { celebrate, Joi, Segments } from 'celebrate';

const joiCondition = {
  is: Joi.exist(),
  then: Joi.optional(),
  otherwise: Joi.required(),
};

const validationScheme = Joi.object({
  _id: Joi.string().length(24).optional(),
  productId: Joi.string().length(24).optional(),
  title: Joi.string().min(2).max(30).when('productId', joiCondition),
  image: Joi.object({
    fileName: Joi.string().required(),
    originalName: Joi.string().required(),
  }).when('productId', joiCondition),
  category: Joi.string().when('productId', joiCondition),
  description: Joi.string().optional(),
  price: Joi.number().optional(),
});

const validateProducts = celebrate({
  [Segments.BODY]: validationScheme,
});

export default validateProducts;
