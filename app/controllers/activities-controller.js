const express = require('express');
const router = new express.Router({ mergeParams: true });

const ActivitiesModel = require('../models/activity-model');
const ActivitiesViewModel = require('../view-models/unsorted-activity-view-model');
const SmartAnswersViewModel = require('../view-models/smart-answers-view-model');


router.get('/', (req, res, next) => {
  const accountId = req.params.accountId;
  const group = req.params.group;
  const version = res.locals.version;

  Promise.all([
    ActivitiesModel.findUnsortedByVersionAccountIdAndGroup(version, accountId, group),
    ActivitiesModel.findSortedByAccountIdAndGroupByCategory(accountId, version, group),
  ]).then(results => {
    const unsortedActivities = results[0];
    const sortedActivities = results[1];
    res.render('activities', Object.assign(
      { accountId, group, version },
      new SmartAnswersViewModel(sortedActivities, version),
      new ActivitiesViewModel(unsortedActivities, false, '', version, group)
    ));
  }).catch((err) => next(err));
});

module.exports = router;
