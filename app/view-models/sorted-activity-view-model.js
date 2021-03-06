/* eslint-disable no-underscore-dangle */
const i18n = require('i18n');
const decorateActivity = require('../locales/activity-decorator');
const sortActivities = require('../controllers/activity-sorter');
const allActivitiesLength = require('../models/activities').length;

module.exports = class ActivityViewModel {

  constructor(activities, options) {
    this.activities = sortActivities(activities.map(decorateActivity));
    this.action = this.getAction(options);
    this.isResortMode = this.action.mode === 'resort';
    this.perCategory = {
      DOING: this.activityStats(this.activities.filter(x => x.category === 'DOING')),
      READY: this.activityStats(this.activities.filter(x => x.category === 'READY')),
      HELP: this.activityStats(this.activities.filter(x => x.category === 'HELP')),
      'NOT-SUITABLE': this.activityStats(this.activities
        .filter(x => x.category === 'NOT-SUITABLE')),
    };
    this.showNavigation = activities.length !== allActivitiesLength;
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
