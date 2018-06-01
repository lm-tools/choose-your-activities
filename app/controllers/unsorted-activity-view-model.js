const decorateActivity = require('../locales/activity-decorator');
const sortActivities = require('./activity-sorter');
const i18n = require('i18n');

module.exports = class ActivityViewModel {

  constructor(unsorted, toSort, lastSortedActivity, group = '') {
    this.activities = unsorted.map(decorateActivity);
    this.activities = toSort ? sortActivities(this.activities) : this.activities;
    if (lastSortedActivity) {
      this.categorisedActivity = decorateActivity(lastSortedActivity);
    }
    if (group) {
      // eslint-disable-next-line no-underscore-dangle
      this.title = i18n.__(`activity-group.${group}.title`);
      // eslint-disable-next-line no-underscore-dangle
      this.canDo = i18n.__(this.activities.length > 1 ? 'activities.can-do.other'
        : 'activities.can-do.one', this.activities.length);
    }
  }
};
