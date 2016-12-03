const knexCleaner = require('knex-cleaner');
const knex = require('../../../app/db').knex;

module.exports = {
  cleanDb() {
    return knexCleaner.clean(knex, { ignoreTables: ['knex_migrations'] });
  },
  addSortedActivity(accountId, activity, category) {
    return knex('sorted_activity').insert(
      { accountId, activity, category, created_at: new Date(), updated_at: new Date() }
    );
  },
};
