const express = require('express');
const router = new express.Router({ mergeParams: true });

const ActivitiesModel = require('../models/activity-model');
const ActivitiesViewModel = require('./unsorted-activity-view-model');

router.get('/', (req, res, next) => {
  const accountId = req.params.accountId;
  const lastSortedActivityName = req.query.sorted || '';

  Promise.all([
    ActivitiesModel.findUnsortedByAccountId(accountId),
    ActivitiesModel.getSortedByName(accountId, lastSortedActivityName),
  ]).then(results => {
    const unsorted = results[0];
    const lastSortedActivity = results[1];
    if (unsorted.length > 0) {
      res.render('unsorted-activities', Object.assign({ accountId },
        new ActivitiesViewModel(unsorted, lastSortedActivity)));
    } else {
      res.render('unsorted-activities-all-sorted', { accountId });
    }
  }).catch((err) => next(err));
});

module.exports = router;
