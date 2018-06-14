const activityGroupMapping = require('../controllers/activity-group-mapping');
const resolveGroupTitle = require('../locales/activity-group-title-resolver');
const groups = require('../models/activity-group');

module.exports = class ActivityGroupViewModel {

  constructor(version, excludeGroup = '') {
    this.activityGroups = this.activityGroupView(version, excludeGroup);
  }

  activityGroupView(version, excludeGroup) {
    return groups
      .filter(group => group !== excludeGroup)
      .map((activityGroup) => ({
        title: resolveGroupTitle(version, activityGroup),
        name: activityGroup,
        count: activityGroupMapping.getCountOfActivitiesForGroup(version, activityGroup),
      }));
  }
};
