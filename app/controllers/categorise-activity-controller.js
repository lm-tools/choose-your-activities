const express = require('express');
const router = new express.Router({ mergeParams: true });

const CategoryView = require('../view-models/category-view-model');
const ActivitiesModel = require('../models/activity-model');
const SmartAnswersViewModel = require('../view-models/smart-answers-view-model');

const validator = require('../validators/categorise-activity-validator');
const groupsPrototypeVersion = require('./version-utils');
const resolveGroupTitle = require('../locales/activity-group-title-resolver');

/* eslint-disable no-underscore-dangle */
const i18n = require('i18n');

function getActivityTitle(activityId) {
  return i18n.__(`activity.${activityId}.title`);
}

router.get('', validator.get, (req, res) => {
  const { accountId, activityId } = req.params;
  const group = req.params.group ? req.params.group : 'GRP-1';
  const { version } = res.locals;
  const previousCategory = req.query && req.query.previousCat || '';

  const categoryView = new CategoryView();
  const title = getActivityTitle(activityId);
  const groupTitle = resolveGroupTitle(version, group);
  const model = Object.assign(
    { accountId, activityId, group, title, groupTitle, previousCategory },
    categoryView
  );

  res.render(`categorise-activity-${version}`, model);
});

function renderGotoActivitiesPage(accountId, version, group, res) {
  ActivitiesModel.findSortedByAccountIdAndGroupByCategory(accountId, version, group)
    .then((sortedActivities) => {
      const title = resolveGroupTitle(version, group);
      const model = Object.assign(
        { accountId, group, title, version },
        new SmartAnswersViewModel(sortedActivities)
      );

      res.render('go-to-activities', model);
    });
}

router.post('', validator.post, (req, res) => {
  const { accountId, activityId } = req.params;
  const { category, group, previousCategory } = req.body;
  const { basePath, version } = res.locals;

  ActivitiesModel.updateCategorisation(accountId, activityId, category)
    .then(result => {
      if (groupsPrototypeVersion(version)) {
        ActivitiesModel.findUnsortedByAccountIdVersionAndGroup(accountId, version, group)
          .then(unsortedActivities => {
            if (previousCategory) {
              res.redirect(
                `${basePath}/${accountId}/groups/${group}/activities/chosen?cat=${previousCategory}`
              );
            } else if (unsortedActivities.length > 0) {
              res.redirect(`${basePath}/${accountId}/groups/${group}/activities`);
            } else {
              renderGotoActivitiesPage(accountId, version, group, res);
            }
          });
      } else if (result.status === 'UPDATED') {
        res.redirect(`${basePath}/${accountId}/activities/sorted/resort`);
      } else {
        res.redirect(`${basePath}/${accountId}/activities/unsorted?sorted=${activityId}`);
      }
    });
});

module.exports = router;
