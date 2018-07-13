const knex = require('../app/db').knex;

module.exports = {
  getTotalSortedActivitiesCsv: function getTotalSortedActivities() {
    let output = 'interventionRef,totalSorted\n';

    return knex('sorted_activity')
      .select('accountId as interventionRef')
      .count('accountId as totalSorted')
      .groupBy('accountId')
      .then((result) => {
        result.forEach((account) => {
          output += `${account.interventionRef},${account.totalSorted}\n`;
        });
        return output;
      });
  },
  getTotalSortedActivitiesJson: () =>
    knex('sorted_activity')
      .select('accountId as interventionRef')
      .count('accountId as totalSorted')
      .groupBy('accountId'),
};
