const express = require('express');
const router = new express.Router({ mergeParams: true });

const CategoryView = require('../view-models/category-view-model');
const ActivitiesModel = require('../models/activity-model');
const SmartAnswersViewModel = require('../view-models/smart-answers-view-model');

const validator = require('../validators/categorise-activity-validator');
const categoriesForVersion = require('./category-mapping');
const groupsPrototypeVersion = require('./version-utils');
const resolveGroupTitle = require('../locales/activity-group-title-resolver');

/* eslint-disable no-underscore-dangle */
const i18n = require('i18n');

function getActivityTitle(activityId) {
  return i18n.__(`activity.${activityId}.title`);
}

router.get('', validator.get, (req, res) => {
  const accountId = req.params.accountId;
  const activityId = req.params.activityId;
  const group = req.params.group ? req.params.group : 'GRP-1';
  const version = res.locals.version;
  const categoryView = new CategoryView(categoriesForVersion(version));

  const title = getActivityTitle(activityId);
  const groupTitle = resolveGroupTitle(version, group);
  res.render(`categorise-activity-${version}`, Object.assign(
    { accountId, activityId, group, title, groupTitle }, categoryView));
});

function renderGotoActivitiesPage(accountId, version, group, res) {
  ActivitiesModel.findSortedByAccountIdAndGroupByCategory(accountId, version, group)
    .then((sortedActivities) => {
      const title = resolveGroupTitle(version, group);
      res.render('go-to-activities', Object.assign({ accountId, group, title, version },
        new SmartAnswersViewModel(sortedActivities, version)
      ));
    });
}

router.post('', validator.post, (req, res) => {
  const accountId = req.params.accountId;
  const activity = req.params.activityId;
  const category = req.body.category;
  const group = req.body.group;
  const basePath = res.locals.basePath;
  const version = res.locals.version;

  ActivitiesModel.updateCategorisation(accountId, activity, category)
    .then(result => {
      if (groupsPrototypeVersion(version)) {
        ActivitiesModel.findUnsortedByAccountIdVersionAndGroup(accountId, version, group)
          .then(unsortedActivities => {
            if (unsortedActivities.length > 0) {
              res.redirect(`${basePath}/${accountId}/groups/${group}/activities`);
            } else {
              renderGotoActivitiesPage(accountId, version, group, res);
            }
          });
      } else if (result.status === 'UPDATED') {
        res.redirect(`${basePath}/${accountId}/activities/sorted/resort`);
      } else {
        res.redirect(`${basePath}/${accountId}/activities/unsorted?sorted=${activity}`);
      }
    });
});

module.exports = router;
