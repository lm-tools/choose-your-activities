const express = require('express');
const router = new express.Router({ mergeParams: true });

const ActivitiesModel = require('../models/activity-model');
const ActivitiesViewModel = require('./unsorted-activity-view-model');

router.get('/', (req, res, next) => {
  const accountId = req.params.accountId;
  const version = res.locals.version;
  const lastSortedActivityName = req.query.sorted || '';
  const basePath = res.locals.basePath;

  Promise.all([
    ActivitiesModel.findUnsortedByAccountId(accountId),
    ActivitiesModel.getSortedByName(accountId, lastSortedActivityName),
  ]).then(results => {
    const unsorted = results[0];
    const lastSortedActivity = results[1];
    if (version === 'a') {
      res.redirect(`${basePath}/${accountId}/groups`);
    } else if (unsorted.length > 0) {
      res.render(`unsorted-activities-${version}`, Object.assign({ accountId },
        new ActivitiesViewModel(unsorted, true, lastSortedActivity)));
    } else {
      res.render(`unsorted-activities-all-sorted-${version}`, { accountId });
    }
  }).catch((err) => next(err));
});

module.exports = router;
