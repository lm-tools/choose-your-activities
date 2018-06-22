const express = require('express');
const router = new express.Router({ mergeParams: true });

const ActivitiesModel = require('../models/activity-model');
const ActivitiesViewModel = require('../view-models/unsorted-activity-view-model');
const SmartAnswersViewModel = require('../view-models/smart-answers-view-model');


router.get('/', (req, res, next) => {
  const accountId = req.params.accountId;
  const group = req.params.group;
  const version = res.locals.version;
  const basePath = res.locals.basePath;

  Promise.all([
    ActivitiesModel.findUnsortedByAccountIdVersionAndGroup(accountId, version, group),
    ActivitiesModel.findSortedByAccountIdAndGroupByCategory(accountId, version, group),
  ]).then(([unsortedActivities, sortedActivities]) => {
    if (unsortedActivities.length === 0) {
      return res.redirect(`${basePath}/${accountId}/groups/${group}/activities/chosen`);
    }

    return res.render('activities', Object.assign(
      { accountId, group, version },
      new SmartAnswersViewModel(sortedActivities, version),
      new ActivitiesViewModel(unsortedActivities, false, '', version, group)
    ));
  }).catch((err) => next(err));
});

router.post('/', (req, res) => {
  const { accountId, group } = req.params;
  const version = res.locals.version;
  ActivitiesModel.clearCategorisationForGroup(accountId, version, group)
    .then(() => ActivitiesModel.findUnsortedByAccountIdVersionAndGroup(accountId, version, group))
    .then((unsortedActivities) =>
      res.render('activities', Object.assign(
        { accountId, group, version },
        new SmartAnswersViewModel([], version),
        new ActivitiesViewModel(unsortedActivities, false, '', version, group)
      )));
});

module.exports = router;
