const decorateActivity = require('../locales/activity-decorator');
const sortActivities = require('./activity-sorter');

module.exports = class ActivityViewModel {

  constructor(unsorted, toSort, lastSortedActivity = '') {
    this.activities = unsorted.map(decorateActivity);
    this.activities = toSort ? sortActivities(this.activities) : this.activities;
    if (lastSortedActivity) {
      this.categorisedActivity = decorateActivity(lastSortedActivity);
    }
  }
};
