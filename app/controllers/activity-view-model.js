const i18n = require('i18n');
const activityCopy = require('../locales/activity-copy');
const sortActivities = require('./activity-sorter');

module.exports = class ActivityViewModel {

  constructor(activities, options) {
    this.activities = sortActivities(activities.map(this.activityModel));
    this.perCategory = {
      DOING: this.activityStats(this.activities.filter(x => x.category === 'DOING')),
      READY: this.activityStats(this.activities.filter(x => x.category === 'READY')),
      HELP: this.activityStats(this.activities.filter(x => x.category === 'HELP')),
      NOTWORKED: this.activityStats(this.activities.filter(x => x.category === 'NOT-WORKED')),
      NO: this.activityStats(this.activities.filter(x => x.category === 'NO')),
    };
    this.isResortMode = options && options.action && options.action === 'resort';
  }

  activityModel(activity) {
    return Object.assign(activityCopy(activity), activity);
  }

  activityStats(activities) {
    return ({
      activities,
      hasActivities: activities.length > 0,
      categoryIntroduction: this.getCategoryIntroText(activities),
    });
  }

  getCategoryIntroText(activities) {
    if (activities.length === 1) {
      // eslint-disable-next-line no-underscore-dangle
      return i18n.__('sorted-activities.show-single-activity');
    }
    // eslint-disable-next-line no-underscore-dangle
    return i18n.__('sorted-activities.show-multiple-activities',
      { totalActivities: activities.length });
  }
};
