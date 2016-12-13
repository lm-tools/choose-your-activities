const express = require('express');
const router = new express.Router({ mergeParams: true });

const ActivitiesModel = require('../models/activity-model');
const ActivitiesViewModel = require('./activity-view-model');

router.get('/', (req, res, next) => {
  const accountId = req.params.accountId;

  ActivitiesModel
    .findUnsortedByAccountId(accountId)
    .then(sortedActivities => {
      res.render('unsorted-activities', Object.assign({ accountId },
        new ActivitiesViewModel(sortedActivities)));
    })
    .catch((err) => next(err));
});

module.exports = router;
