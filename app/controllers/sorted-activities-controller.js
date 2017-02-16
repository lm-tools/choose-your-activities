const express = require('express');
const router = new express.Router({ mergeParams: true });
const ActivitiesModel = require('../models/activity-model');
const ActivitiesViewModel = require('./activity-view-model');

router.get('/', (req, res, next) => {
  const accountId = req.params.accountId;

  ActivitiesModel
    .findSortedByAccountId(accountId)
    .then(sortedActivities => {
      res.render('sorted-activities', Object.assign({ accountId },
        new ActivitiesViewModel(sortedActivities, { action: 'view' })));
    })
    .catch((err) => next(err));
});

router.get('/resort', (req, res, next) => {
  const accountId = req.params.accountId;

  ActivitiesModel
    .findSortedByAccountId(accountId)
    .then(sortedActivities => {
      res.render('sorted-activities', Object.assign({ accountId },
        new ActivitiesViewModel(sortedActivities, { action: 'resort' })));
    })
    .catch((err) => next(err));
});

module.exports = router;
