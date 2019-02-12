const Joi = require('joi');
const celebrate = require('celebrate');
const activities = require('../models/activities');
const categories = require('../models/categories');

module.exports = {
  get: celebrate({
    params: Joi.object().keys({
      activityId: Joi.any().valid(activities).required(),
      sortType: Joi.string().optional(),
      accountId: Joi.string().required(),
      version: Joi.string().required(),
      group: Joi.string().optional(),
    }),
  }),
  post: celebrate({
    params: Joi.object().keys({
      activityId: Joi.any().valid(activities).required(),
      sortType: Joi.string().optional(),
      accountId: Joi.string().required(),
      version: Joi.string().required(),
      group: Joi.string().optional(),
    }),
    body: Joi.object().keys({
      category: Joi.any().valid(categories).required(),
      group: Joi.string().optional(),
      previousCategory: Joi.string().optional(),
    }),
  }),
};
