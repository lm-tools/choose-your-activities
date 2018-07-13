const introduction = require('./introduction-controller');

const cookie = require('./cookie-controller');
const healthCheck = require('./health-check-controller');

const activityDetails = require('./activity-details-controller');
const activityGroup = require('./activity-group-controller');
const activities = require('./activities-controller');
const chosenActivities = require('./chosen-activities-controller');
const categoriseActivity = require('./categorise-activity-controller');
const sortedActivities = require('./sorted-activities-controller');
const unsortedActivities = require('./unsorted-activities-controller');
const metrics = require('./metrics-controller');

module.exports = {
  introduction,
  cookie,
  healthCheck,
  activityDetails,
  activityGroup,
  activities,
  chosenActivities,
  categoriseActivity,
  sortedActivities,
  unsortedActivities,
  metrics,
};
