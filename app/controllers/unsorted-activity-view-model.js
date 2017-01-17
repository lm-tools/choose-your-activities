const activityCopy = require('../locales/activity-copy');
const sortActivities = require('./activity-sorter');

module.exports = class ActivityViewModel {

  constructor(unsorted, lastSortedActivity) {
    this.activities = [].concat(unsorted.map(x => this.activityModel(x, false)));
    this.activities = sortActivities(this.activities);
    if (lastSortedActivity) {
      this.categorisedActivity = this.activityModel(lastSortedActivity);
    }
  }

  activityModel(activity) {
    return Object.assign(activityCopy(activity), activity);
  }
};
