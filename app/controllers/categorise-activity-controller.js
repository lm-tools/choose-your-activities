const express = require('express');
const router = new express.Router({ mergeParams: true });

/* eslint-disable no-underscore-dangle */
const i18n = require('i18n');

function getActivityTitle(activityId) {
  return i18n.__(`activity.${activityId}.title`);
}

router.get('/:activityId', (req, res) => {
  const accountId = req.params.accountId;
  const activityId = req.params.activityId;

  res.render('categorise-activity', { accountId, activityId, title: getActivityTitle(activityId) });
});

module.exports = router;
