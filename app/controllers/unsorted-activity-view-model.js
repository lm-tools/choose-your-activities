const activityCopy = require('../locales/activity-copy');
const sortActivities = require('./activity-sorter');

module.exports = class ActivityViewModel {

  constructor(unsorted, toSort, lastSortedActivity = '') {
    this.activities = [].concat(unsorted.map(x => activityCopy(x)));
    this.activities = toSort ? sortActivities(this.activities) : this.activities;
    if (lastSortedActivity) {
      this.categorisedActivity = activityCopy(lastSortedActivity);
    }
  }
};
