import { celebrate, Joi, Segments } from 'celebrate';
import { paymentMethods } from '../models/orders';

const validationScheme = Joi.object({
  payment: Joi.string()
    .valid(...paymentMethods)
    .required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  total: Joi.number().required(),
  items: Joi.array().items(Joi.string()).required(),
});

export const validateOrder = celebrate({
  [Segments.BODY]: validationScheme,
});
