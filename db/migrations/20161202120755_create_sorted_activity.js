exports.up = (knex) =>
  knex.schema.createTable('sorted_activity', (table) => {
    table.uuid('accountId');
    table.string('activity');
    table.string('category');
    table.timestamps();
  });

exports.down = (knex) => knex.schema.dropTable('sorted_activity');
