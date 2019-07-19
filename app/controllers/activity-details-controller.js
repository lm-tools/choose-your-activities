const express = require('express');
const router = new express.Router({ mergeParams: true });
const validator = require('../validators/activity-details-validator');
const decorateActivity = require('../locales/activity-decorator');
const i18n = require('i18n');

/* eslint-disable no-underscore-dangle */
function getActivityTitle(activityId) {
  return i18n.__('activities-details.pageTitle', i18n.__(`activity.${activityId}.title`));
}

router.get('', validator.get, (req, res) => {
  const { accountId, activityId } = req.params;
  const title = getActivityTitle(activityId);

  res.render('activity-details',
    {
      accountId,
      title,
      activity: decorateActivity({ activity: req.params.activityId }),
      backPath: req.query.from === 'resort' ? '/activities/sorted/resort' : '/activities/sorted',
    }
  );
});

module.exports = router;
