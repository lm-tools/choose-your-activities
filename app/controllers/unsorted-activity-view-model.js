const decorateActivity = require('../locales/activity-decorator');
const sortActivities = require('./activity-sorter');
/* eslint-disable no-underscore-dangle */
const i18n = require('i18n');

module.exports = class ActivityViewModel {

  constructor(unsorted, toSort, lastSortedActivity, version = '', group = '') {
    this.activities = unsorted.map(decorateActivity);
    this.activities = toSort ? sortActivities(this.activities) : this.activities;
    if (lastSortedActivity) {
      this.categorisedActivity = decorateActivity(lastSortedActivity);
    }
    if (group) {
      this.title = i18n.__(`activity-group.${version}.${group}.title`);
      this.canDo = i18n.__(this.activities.length > 1 ? 'activities.can-do.other'
        : 'activities.can-do.one');
    }
  }
};
