exports.up = knex => knex('sorted_activity')
  .where({ activity: 'ACT-3' })
  .del();

exports.down = (knex, Promise) => Promise.resolve();
