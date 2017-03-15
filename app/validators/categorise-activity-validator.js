const Joi = require('joi');
const celebrate = require('celebrate');
const activities = require('../models/activities');

module.exports = {
  get: celebrate({
    params: Joi.object().keys({
      activityId: Joi.any().valid(activities),
      accountId: Joi.string(),
    }),
  }),
  post: celebrate({
    params: Joi.object().keys({
      activityId: Joi.any().valid(activities),
      accountId: Joi.string(),
    }),
  }),
};

