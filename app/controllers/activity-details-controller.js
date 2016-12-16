const express = require('express');
const router = new express.Router({ mergeParams: true });
const ActivityViewModel = require('./activity-view-model');

router.get('', (req, res) => {
  const accountId = req.params.accountId;
  res.render('activity-details',
    {
      accountId,
      activity: new ActivityViewModel([]).activityModel({ activity: req.params.activityId }),
    }
  );
});

module.exports = router;
