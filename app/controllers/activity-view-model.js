const i18n = require('i18n');

module.exports = class ActivityViewModel {

  constructor(activities) {
    this.activities = activities.map(this.activityModel);
  }

  activityModel(activity) {
    return Object.assign(
      {
        // eslint-disable-next-line no-underscore-dangle
        title: i18n.__(`activity.${activity.activity}.title`),
      }, activity);
  }
};
