const i18n = require('i18n');
const sortActivities = require('./activity-sorter');

module.exports = class ActivityViewModel {

  constructor(unsorted, lastSortedActivity) {
    this.activities = [].concat(unsorted.map(x => this.activityModel(x, false)));
    if (lastSortedActivity) {
      this.activities.push(this.activityModel(lastSortedActivity, true));
    }
    this.activities = sortActivities(this.activities);
  }

  activityModel(activity, sorted) {
    return Object.assign(
      {
        // eslint-disable-next-line no-underscore-dangle
        title: i18n.__(`activity.${activity.activity}.title`),
        // eslint-disable-next-line no-underscore-dangle
        details: i18n.__(`activity.${activity.activity}.details`),
        sorted,
      }, activity);
  }
};
