const express = require('express');
const router = new express.Router({ mergeParams: true });

const ActivitiesModel = require('../models/activity-model');
const ActivitiesViewModel = require('./unsorted-activity-view-model');

router.get('/', (req, res) => {
  const accountId = req.params.accountId;
  const group = req.params.group;
  const version = res.locals.version;

  ActivitiesModel.findUnsortedByVersionAccountIdAndGroup(version, accountId, group)
    .then(activities => {
      res.render('activities', Object.assign({
        accountId,
        group,
      }, new ActivitiesViewModel(activities, false, '', group)));
    });
});

module.exports = router;
