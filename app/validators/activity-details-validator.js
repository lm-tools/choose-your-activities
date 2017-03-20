const Joi = require('joi');
const celebrate = require('celebrate');
const activities = require('../models/activities');

module.exports = {
  get: celebrate({
    params: Joi.object().keys({
      activityId: Joi.any().valid(activities).required(),
      accountId: Joi.string().required(),
    }),
  }),
};

