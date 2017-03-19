const express = require('express');
const router = new express.Router({ mergeParams: true });
const ActivityViewModel = require('./activity-view-model');
const validator = require('../validators/activity-details-validator');

router.get('', validator.get, (req, res) => {
  const accountId = req.params.accountId;
  res.render('activity-details',
    {
      accountId,
      activity: new ActivityViewModel([]).activityModel({ activity: req.params.activityId }),
      backPath: req.query.from === 'resort' ? '/activities/sorted/resort' : '/activities/sorted',
    }
  );
});

module.exports = router;
