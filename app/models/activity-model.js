const db = require('../db');
const activities = require('./activities');

module.exports = db.Model.extend(
  {
    tableName: 'sorted_activity',
    hasTimestamps: true,
  },
  {
    findSortedByAccountId(accountId) {
      const query = this.forge().query({ where: { accountId } });
      return query.fetchAll().then((queryResult) => queryResult.serialize());
    },
    findUnsortedByAccountId(accountId) {
      return this.findSortedByAccountId(accountId)
        .then(sortedActivities => {
          const sortedActivityNames = sortedActivities.map((x) => x.activity);
          return activities
            .filter(x => sortedActivityNames.indexOf(x) === -1)
            .map(x => ({ activity: x }));
        });
    },

  }
);
