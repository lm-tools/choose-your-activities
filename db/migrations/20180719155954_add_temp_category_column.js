exports.up = knex => knex.schema.table('sorted_activity', t => t.string('category_prev'));

exports.down = knex => knex.schema.table('sorted_activity', t => t.dropColumn('category_prev'));
