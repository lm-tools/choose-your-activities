const Joi = require('joi');
const celebrate = require('celebrate');
const activities = require('../models/activities');
const categories = require('../models/categories');

module.exports = {
  get: celebrate({
    params: Joi.object().keys({
      activityId: Joi.any().valid(activities).required(),
      accountId: Joi.string().required(),
    }),
  }),
  post: celebrate({
    params: Joi.object().keys({
      activityId: Joi.any().valid(activities).required(),
      accountId: Joi.string().required(),
    }),
    body: Joi.object().keys({
      category: Joi.any().valid(categories).required(),
    }),
  }),
};
