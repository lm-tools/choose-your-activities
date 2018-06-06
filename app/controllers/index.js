const introduction = require('./introduction-controller');

const cookie = require('./cookie-controller');
const healthCheck = require('./health-check-controller');

const activityDetails = require('./activity-details-controller');
const activityGroup = require('./activity-group-controller');
const activities = require('./activities-controller');
const activityGroupDetails = require('./activity-group-details-controller');
const categoriseActivity = require('./categorise-activity-controller');
const sortedActivities = require('./sorted-activities-controller');
const unsortedActivities = require('./unsorted-activities-controller');


module.exports = {
  introduction,
  cookie,
  healthCheck,
  activityDetails,
  activityGroup,
  activities,
  activityGroupDetails,
  categoriseActivity,
  sortedActivities,
  unsortedActivities,
};
