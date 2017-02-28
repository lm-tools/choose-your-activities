const knex = require('../app/db').knex;

module.exports = {
  getTotalSortedJobs: function getTotalSortedJobs() {
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
};
