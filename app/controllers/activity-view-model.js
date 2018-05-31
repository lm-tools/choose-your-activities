const i18n = require('i18n');
const activityCopy = require('../locales/activity-copy');
const sortActivities = require('./activity-sorter');
const allActivitiesLength = require('../models/activities').length;
/* eslint-disable no-underscore-dangle */

module.exports = class ActivityViewModel {

  constructor(activities, options) {
    this.activities = sortActivities(activities.map(activityCopy));
    this.action = this.getAction(options);
    this.isResortMode = this.action.mode === 'resort';
    this.perCategory = {
      DOING: this.activityStats(this.activities.filter(x => x.category === 'DOING')),
      READY: this.activityStats(this.activities.filter(x => x.category === 'READY')),
      HELP: this.activityStats(this.activities.filter(x => x.category === 'HELP')),
      NOTWORKED: this.activityStats(this.activities.filter(x => x.category === 'NOT-WORKED')),
      NO: this.activityStats(this.activities.filter(x => x.category === 'NO')),
    };
    this.showNavigation = activities.length !== allActivitiesLength;
  }

  activityModel(activity) {
    return Object.assign(activityCopy(activity), activity);
  }

  activityStats(activities) {
    return ({
      activities,
      hasActivities: activities.length > 0,
      categoryIntroduction: this.getCategoryIntroText(activities),
      isExpanded: this.isResortMode,
    });
  }

  getCategoryIntroText(activities) {
    if (activities.length === 1) {
      return i18n.__('sorted-activities.show-single-activity');
    }
    return i18n.__('sorted-activities.show-multiple-activities',
      { totalActivities: activities.length });
  }

  getAction(options) {
    const mode = options ? options.action : null;
    if (mode === 'resort') {
      return {
        mode,
        label: i18n.__('sorted-activities.finish-sorting-button'),
        link: '/activities/sorted',
      };
    }
    return {
      mode,
      label: i18n.__('sorted-activities.resort-button'),
      link: '/activities/sorted/resort',
    };
  }
};
