const knexCleaner = require('knex-cleaner');
const { knex } = require('../../../app/db');

const SortedActivities = require('../../../app/models/activity-model');
const allActivities = require('../../../app/models/activities');
const categories = require('../../../app/models/categories');

function random(size) {
  return Math.floor(Math.random() * size);
}

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

  saveAllActivitiesAsSorted(accountId) {
    return this.addSortedActivities(accountId, allActivities.map(a =>
        ({ activity: a, category: categories[random(categories.length)] })
      )
    );
  },
};
