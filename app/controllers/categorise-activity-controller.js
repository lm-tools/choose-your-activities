const express = require('express');
const router = new express.Router({ mergeParams: true });

const CategoryView = require('./category-view-model');
const ActivitiesModel = require('../models/activity-model');
const validator = require('../validators/categorise-activity-validator');
const categoriesForVersion = require('./category-mapping');
const groupsPrototypeVersion = require('./version-utils');

/* eslint-disable no-underscore-dangle */
const i18n = require('i18n');

function getActivityTitle(activityId) {
  return i18n.__(`activity.${activityId}.title`);
}

function getGroupTitle(group, version) {
  return groupsPrototypeVersion(version) ? i18n.__(`activity-group.${version}.${group}.title`) : '';
}

router.get('', validator.get, (req, res) => {
  const accountId = req.params.accountId;
  const activityId = req.params.activityId;
  const group = req.params.group ? req.params.group : 'GRP-1';
  const version = res.locals.version;
  const categoryView = new CategoryView(categoriesForVersion(version));

  const title = getActivityTitle(activityId);
  const groupTitle = getGroupTitle(group, version);
  res.render(`categorise-activity-${version}`, Object.assign(
    { accountId, activityId, group, title, groupTitle }, categoryView));
});

router.post('', validator.post, (req, res) => {
  const accountId = req.params.accountId;
  const activity = req.params.activityId;
  const category = req.body.category;
  const group = req.body.group;
  const basePath = res.locals.basePath;
  const version = res.locals.version;

  ActivitiesModel.updateCategorisation(accountId, activity, category)
    .then((result) => {
      if (result.status === 'UPDATED') {
        res.redirect(`${basePath}/${accountId}/activities/sorted/resort`);
      } else if (groupsPrototypeVersion(version)) {
        ActivitiesModel.findUnsortedByVersionAccountIdAndGroup(version, accountId, group)
          .then(unsortedActivities => {
            if (unsortedActivities.length > 0) {
              res.redirect(`${basePath}/${accountId}/groups/${group}/activities`);
            } else {
              const title = getGroupTitle(group, version);
              res.render('go-to-activities', { accountId, group, title });
            }
          });
      } else {
        res.redirect(`${basePath}/${accountId}/activities/unsorted?sorted=${activity}`);
      }
    });
});

module.exports = router;
