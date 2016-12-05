const i18n = require('i18n');

module.exports = class ActivityViewModel {

  constructor(accountId, activities) {
    this.accountId = accountId;
    this.activities = this.activityView(activities);
  }

  activityView(activities) {
    return activities
      .map((activity) => Object.assign(
        {
          // eslint-disable-next-line no-underscore-dangle
          title: i18n.__(`activity.${activity}.title`),
          name: activity,
        }));
  }
};
