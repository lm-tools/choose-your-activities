exports.up = (knex) =>
  knex.schema.table('sorted_activity', (table) => {
    table.increments('id').primary();
  });

exports.down = (knex) =>
  knex.schema.table('sorted_activity', (table) => {
    table.dropColumn('id');
  });
