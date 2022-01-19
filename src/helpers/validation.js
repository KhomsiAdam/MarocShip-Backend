const Joi = require('joi');

// User schema for validation
const userSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ma'] } })
    .trim()
    .required(),

  password: Joi.string()
    .trim()
    .min(10)
    .required(),

  distanceTraveled: Joi.number()
    .positive(),

  truck: Joi.string()
    .alphanum()
    .trim(),
});

// Delivery schema for validation
const deliverySchema = Joi.object({
  weight: Joi.number()
    .positive()
    .required(),

  amount: Joi.number()
    .positive(),

  region: Joi.string()
    .alphanum()
    .trim()
    .valid('Local', 'Europe', 'America', 'Asia', 'Australia')
    .required(),

  from: Joi.string()
    .alphanum()
    .trim()
    .required(),

  to: Joi.string()
    .alphanum()
    .trim()
    .required(),

  distance: Joi.number()
    .positive(),

  date: Joi.date()
    .min('now')
    .required(),

  type: Joi.string()
    .alphanum()
    .trim(),

  available: Joi.boolean(),

  driver: Joi.string()
    .alphanum()
    .trim(),
});

module.exports = {
  userSchema,
  deliverySchema,
};
