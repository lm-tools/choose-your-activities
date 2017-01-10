const express = require('express');
const router = new express.Router({ mergeParams: true });

const categories = require('../models/categories');
const CategoryView = require('./category-view-model');

const ActivitiesModel = require('../models/activity-model');

/* eslint-disable no-underscore-dangle */
const i18n = require('i18n');

function getActivityTitle(activityId) {
  return i18n.__(`activity.${activityId}.title`);
}

function upsertActivityCategory(currentActivityModel, category) {
  return new ActivitiesModel(currentActivityModel).fetch().then((modelFound) => {
    if (modelFound) {
      return modelFound.save({ category });
    }
    return new ActivitiesModel(Object.assign(currentActivityModel, { category })).save();
  });
}

router.get('', (req, res) => {
  const accountId = req.params.accountId;
  const activityId = req.params.activityId;
  const categoryView = new CategoryView(categories);

  res.render('categorise-activity', Object.assign(
    { accountId, activityId, title: getActivityTitle(activityId) }, categoryView));
});

router.post('', (req, res) => {
  const accountId = req.params.accountId;
  const activity = req.params.activityId;
  const category = req.body.category;
  const basePath = req.app.locals.basePath;

  upsertActivityCategory({ accountId, activity }, category)
    .then(() => {
      res.redirect(`${basePath}/${accountId}/activities/unsorted?sorted=${activity}`);
    });
});

module.exports = router;
