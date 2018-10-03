const decorateActivity = require('../locales/activity-decorator');
const sortActivities = require('../controllers/activity-sorter');
const resolveGroupTitle = require('../locales/activity-group-title-resolver');

module.exports = class ActivityViewModel {

  constructor(unsorted, toSort, lastSortedActivity, version = '', group = '') {
    this.activities = unsorted.map(decorateActivity);
    this.activities = toSort ? sortActivities(this.activities) : this.activities;
    if (lastSortedActivity) {
      this.categorisedActivity = decorateActivity(lastSortedActivity);
    }
    if (group) {
      this.title = resolveGroupTitle(version, group);
    }
  }
};
