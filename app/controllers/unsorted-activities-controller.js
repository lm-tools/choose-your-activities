const express = require('express');
const router = new express.Router({ mergeParams: true });
const activities = require('../models/activities');

const SortedActivities = require('../models/sorted-activity-model');
const ActivityModel = require('./activity-view-model');

function getUnsortedActivities(sortedActivities) {
  const sortedActivityNames = sortedActivities.map((x) => x.activity);
  return activities.filter(x => sortedActivityNames.indexOf(x) === -1).map(x => ({ activity: x }));
}

router.get('/', (req, res, next) => {
  const accountId = req.params.accountId;

  SortedActivities
    .findAllByAccountId(accountId)
    .then((sortedActivities) => {
      res.render('unsorted-activities', Object.assign({ accountId },
        new ActivityModel(getUnsortedActivities(sortedActivities))));
    })
    .catch((err) => next(err));
});

module.exports = router;
