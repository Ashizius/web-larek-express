import { celebrate, Joi, Segments } from 'celebrate';

const joiCondition = { is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required() }

const validationScheme = Joi.object({
  _id: Joi.string().length(24).optional(),
  name: Joi.string().min(2).max(30).when('_id', joiCondition),
  email: Joi.string().email().when('_id', joiCondition),
  password: Joi.string().when('_id', joiCondition),
  //passwordConfirm: Joi.valid(Joi.ref("password")).required(),
});

const validationLoginScheme = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const validateUser = celebrate({
  [Segments.BODY]: validationScheme,
});

export const validateLogin = celebrate({
  [Segments.BODY]: validationLoginScheme,
});
