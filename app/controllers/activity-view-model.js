const activityCopy = require('../locales/activity-copy');
const sortActivities = require('./activity-sorter');

module.exports = class ActivityViewModel {

  constructor(activities) {
    this.activities = sortActivities(activities.map(this.activityModel));
    this.perCategory = {
      DOING: this.activityStats(this.activities.filter(x => x.category === 'DOING')),
      READY: this.activityStats(this.activities.filter(x => x.category === 'READY')),
      HELP: this.activityStats(this.activities.filter(x => x.category === 'HELP')),
      NOTWORKED: this.activityStats(this.activities.filter(x => x.category === 'NOT-WORKED')),
      NO: this.activityStats(this.activities.filter(x => x.category === 'NO')),
    };
  }

  activityModel(activity) {
    return Object.assign(activityCopy(activity), activity);
  }

  activityStats(activites) {
    return ({
      activities: activites,
      hasActivities: activites.length > 0,
    });
  }
};
