const knexCleaner = require('knex-cleaner');
const knex = require('../../../app/db').knex;

const SortedActivities = require('../../../app/models/activity-model');

module.exports = {
  cleanDb() {
    return knexCleaner.clean(knex, { ignoreTables: ['knex_migrations'] });
  },
  addSortedActivities(accountId, activities) {
    return knex('sorted_activity').insert(activities.map(x =>
        ({
          accountId,
          activity: x.activity,
          category: x.category,
          created_at: new Date(),
          updated_at: new Date(),
        })
      )
    );
  },
  getSortedActivities(accountId) {
    return SortedActivities.findSortedByAccountId(accountId);
  },
};
