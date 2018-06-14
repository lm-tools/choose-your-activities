const express = require('express');
const router = new express.Router({ mergeParams: true });
const ActivityGroupView = require('../view-models/activity-group-view-model');

router.get('/', (req, res) => {
  const accountId = req.params.accountId;
  const version = res.locals.version;
  const activityGroupView = new ActivityGroupView(version);
  res.render(`activity-group-${version}`, Object.assign({ accountId }, activityGroupView));
});

module.exports = router;
