const express = require('express');
const router = new express.Router({ mergeParams: true });
const activityGroups = require('../models/activity-group');
const ActivityGroupView = require('./activity-group-view-model');

router.get('/', (req, res) => {
  const accountId = req.params.accountId;
  const version = res.locals.version;
  const activityGroupView = new ActivityGroupView(activityGroups, version);
  res.render('activity-group', Object.assign({ accountId }, activityGroupView));
});

module.exports = router;
