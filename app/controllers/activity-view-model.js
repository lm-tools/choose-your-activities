const i18n = require('i18n');

module.exports = class ActivityViewModel {

  constructor(activities) {
    this.activities = activities.map(this.activityModel);
    this.perCategory = {
      DOING: this.activities.filter(x => x.category === 'DOING'),
      READY: this.activities.filter(x => x.category === 'READY'),
      HELP: this.activities.filter(x => x.category === 'HELP'),
      NOTWORKED: this.activities.filter(x => x.category === 'NOT-WORKED'),
      NO: this.activities.filter(x => x.category === 'NO'),
    };
  }

  activityModel(activity) {
    return Object.assign(
      {
        // eslint-disable-next-line no-underscore-dangle
        title: i18n.__(`activity.${activity.activity}.title`),
      }, activity);
  }
};
