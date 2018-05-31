const express = require('express');
const router = new express.Router({ mergeParams: true });
const i18n = require('i18n');

const ActivitiesModel = require('../models/activity-model');
const ActivitiesViewModel = require('./unsorted-activity-view-model');

router.get('/', (req, res) => {
  const accountId = req.params.accountId;
  const group = req.params.group;
  const version = res.locals.version;

  ActivitiesModel.findUnsortedByVersionAccountIdAndGroup(version, accountId, group)
    .then(activities => {
      // eslint-disable-next-line no-underscore-dangle
      const title = i18n.__(`activity-group.${group}.title`);
      // eslint-disable-next-line no-underscore-dangle
      const canDo = i18n.__(activities.length > 1 ? 'activities.can-do.other'
        : 'activities.can-do.one', activities.length);
      res.render('activities', Object.assign({
        accountId,
        title,
        canDo,
        group,
      }, new ActivitiesViewModel(activities, false)));
    });
});

module.exports = router;
