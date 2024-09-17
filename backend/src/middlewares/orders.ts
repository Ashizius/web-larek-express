import { celebrate, Joi, Segments } from 'celebrate';
import { paymentMethods } from '../models/orders';

const joiCondition = {
  is: Joi.exist(),
  then: Joi.optional(),
  otherwise: Joi.required(),
};

const validationScheme = Joi.object({
  _id: Joi.string().optional(),
  payment: Joi.string()
    .valid(...paymentMethods)
    .required(),
  email: Joi.string().email().when('_id', joiCondition),
  phone: Joi.string().when('_id', joiCondition),
  address: Joi.string().when('_id', joiCondition),
  total: Joi.number().when('_id', joiCondition),
  items: Joi.array().items(Joi.string()).when('_id', joiCondition),
});

const validateOrder = celebrate({
  [Segments.BODY]: validationScheme,
});

export default validateOrder;
