const express = require('express');
const router = new express.Router({ mergeParams: true });
const validator = require('../validators/activity-details-validator');
const decorateActivity = require('../locales/activity-decorator');

router.get('', validator.get, (req, res) => {
  const accountId = req.params.accountId;
  res.render('activity-details',
    {
      accountId,
      activity: decorateActivity({ activity: req.params.activityId }),
      backPath: req.query.from === 'resort' ? '/activities/sorted/resort' : '/activities/sorted',
    }
  );
});

module.exports = router;
