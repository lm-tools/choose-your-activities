const db = require('../db');
const activities = require('./activities');
const ActivityGroupMapper = require('../controllers/activity-group-mapping');

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
            .filter(x => !sortedActivityNames.includes(x))
            .map(x => ({ activity: x }));
        });
    },
    findUnsortedByVersionAccountIdAndGroup(version, accountId, group) {
      return this.findSortedByAccountId(accountId)
        .then(sortedActivities => {
          const sortedActivityNames = sortedActivities.map((x) => x.activity);
          return ActivityGroupMapper.getActivitiesForGroup(version, group)
            .filter(x => !sortedActivityNames.includes(x))
            .map(x => ({ activity: x }));
        });
    },

    getSortedByName(accountId, activityName) {
      return this.forge()
        .query({ where: { accountId, activity: activityName } })
        .fetch()
        // eslint-disable-next-line arrow-body-style
        .then(queryResult => {
          return queryResult ? queryResult.serialize() : null;
        });
    },

    updateCategorisation(accountId, activity, category) {
      return this.forge()
        .query({ where: { accountId, activity } }).fetch()
        .then((modelFound) => {
          if (modelFound) {
            return modelFound.save({ category })
              .then(() => ({ status: 'UPDATED' }));
          }
          return this.forge().save({ accountId, activity, category })
            .then(() => ({ status: 'CREATED' }));
        });
    },
  }
);
