const express = require('express');
const router = new express.Router({ mergeParams: true });
const activities = require('../models/activities');

const SortedActivities = require('../models/sorted-activity-model');
const ActivityView = require('./activity-view-model');

function getUnsortedActivityNames(sortedActivities) {
  const sortedActivityNames = sortedActivities.map((x) => x.activity);
  return activities.filter(x => sortedActivityNames.indexOf(x) === -1);
}

router.get('/', (req, res, next) => {
  const accountId = req.params.accountId;

  SortedActivities
    .findAllByAccountId(accountId)
    .then((sortedActivities) => {
      res.render('unsorted-activities',
        new ActivityView(req.params.accountId, getUnsortedActivityNames(sortedActivities)));
    })
    .catch((err) => next(err));
});

module.exports = router;
