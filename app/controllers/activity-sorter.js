function activityNumber(a) {
  return parseInt(a.activity.split('-')[1], 10);
}

module.exports = (activities) =>
  activities.sort((a, b) => activityNumber(a) - activityNumber(b));

