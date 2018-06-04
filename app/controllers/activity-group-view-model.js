const i18n = require('i18n');
const activityGroupMapping = require('./activity-group-mapping');

module.exports = class ActivityGroupViewModel {

  constructor(activityGroups, version) {
    this.activityGroups = this.activityGroupView(activityGroups, version);
  }

  activityGroupView(activityGroups, version) {
    return activityGroups
      .map((activityGroup) => ({
        // eslint-disable-next-line no-underscore-dangle
        title: i18n.__(`activity-group.${version}.${activityGroup}.title`),
        name: activityGroup,
        count: activityGroupMapping.getCountOfActivitiesForGroup(version, activityGroup),
      }));
  }
};
