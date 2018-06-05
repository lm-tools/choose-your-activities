const activityGroupMapping = require('./activity-group-mapping');
const resolveGroupTitle = require('../locales/activity-group-title-resolver');

module.exports = class ActivityGroupViewModel {

  constructor(activityGroups, version) {
    this.activityGroups = this.activityGroupView(activityGroups, version);
  }

  activityGroupView(activityGroups, version) {
    return activityGroups
      .map((activityGroup) => ({
        title: resolveGroupTitle(version, activityGroup),
        name: activityGroup,
        count: activityGroupMapping.getCountOfActivitiesForGroup(version, activityGroup),
      }));
  }
};
