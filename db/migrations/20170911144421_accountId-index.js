exports.up = (knex) =>
  knex.schema.table('sorted_activity', (table) => {
    table.index('accountId');
  });

exports.down = (knex) =>
  knex.schema.table('sorted_activity', (table) => {
    table.dropIndex('accountId');
  });
