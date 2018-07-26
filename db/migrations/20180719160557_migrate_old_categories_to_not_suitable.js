exports.up = knex =>
  knex('sorted_activity')
    .update({ category_prev: knex.raw('??', ['category']) })
    .then(() =>
      knex('sorted_activity')
        .whereIn('category_prev', ['NO', 'NOT-WORKED'])
        .update({ category: 'NOT-SUITABLE' }));

exports.down = knex =>
  knex('sorted_activity')
    .whereIn('category_prev', ['NO', 'NOT-WORKED'])
    .update({ category: knex.raw('??', ['category_prev']) });
