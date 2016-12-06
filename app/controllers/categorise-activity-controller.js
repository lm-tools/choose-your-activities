const express = require('express');
const router = new express.Router({ mergeParams: true });

const categories = require('../models/categories');
const CategoryListView = require('./category-list-view-model');

/* eslint-disable no-underscore-dangle */
const i18n = require('i18n');

function getActivityTitle(activityId) {
  return i18n.__(`activity.${activityId}.title`);
}

router.get('/:activityId', (req, res) => {
  const accountId = req.params.accountId;
  const activityId = req.params.activityId;
  const categoryListView = new CategoryListView(categories);

  res.render('categorise-activity', Object.assign(
    { accountId, activityId, title: getActivityTitle(activityId) }, categoryListView));
});

module.exports = router;
