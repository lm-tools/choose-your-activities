const i18n = require('i18n');
const activityGroupMapping = require('./activity-group-mapping');

module.exports = class ActivityGroupViewModel {

  constructor(activityGroups) {
    this.activityGroups = this.activityGroupView(activityGroups);
  }

  activityGroupView(activityGroups) {
    return activityGroups
      .map((activityGroup) => Object.assign(
        {
          // eslint-disable-next-line no-underscore-dangle
          title: i18n.__(`activity-group.${activityGroup}.title`),
          name: activityGroup,
          count: activityGroupMapping.getCountOfActivitiesForGroup('b', activityGroup),
        }));
  }
};
