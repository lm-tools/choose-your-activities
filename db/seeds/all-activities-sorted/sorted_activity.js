
exports.seed = function (knex) {
  return knex('sorted_activity').del() // Deletes ALL existing entries
    .then(function () { // Inserts seed entries one by one in series
      return knex('sorted_activity').insert([
        {
          id: 100,
          accountId: 'b4be6ba8-fdb0-11e6-b9d4-539e556f06e1',
          activity: 'ACT-1',
          category: 'DOING',
        },
        {
          id: 101,
          accountId: 'b4be6ba8-fdb0-11e6-b9d4-539e556f06e1',
          activity: 'ACT-2',
          category: 'READY',
        },
        {
          id: 102,
          accountId: 'b4be6ba8-fdb0-11e6-b9d4-539e556f06e1',
          activity: 'ACT-3',
          category: 'HELP',
        },
        {
          id: 103,
          accountId: 'b4be6ba8-fdb0-11e6-b9d4-539e556f06e1',
          activity: 'ACT-4',
          category: 'NOT-SUITABLE',
        },
        {
          id: 104,
          accountId: 'b4be6ba8-fdb0-11e6-b9d4-539e556f06e1',
          activity: 'ACT-5',
          category: 'NOT-SUITABLE',
        },
        {
          id: 105,
          accountId: 'b4be6ba8-fdb0-11e6-b9d4-539e556f06e1',
          activity: 'ACT-6',
          category: 'DOING',
        },
        {
          id: 106,
          accountId: 'b4be6ba8-fdb0-11e6-b9d4-539e556f06e1',
          activity: 'ACT-7',
          category: 'READY',
        },
        {
          id: 107,
          accountId: 'b4be6ba8-fdb0-11e6-b9d4-539e556f06e1',
          activity: 'ACT-8',
          category: 'HELP',
        },
        {
          id: 108,
          accountId: 'b4be6ba8-fdb0-11e6-b9d4-539e556f06e1',
          activity: 'ACT-9',
          category: 'NOT-SUITABLE',
        },
        {
          id: 109,
          accountId: 'b4be6ba8-fdb0-11e6-b9d4-539e556f06e1',
          activity: 'ACT-10',
          category: 'NOT-SUITABLE',
        },
        {
          id: 110,
          accountId: 'b4be6ba8-fdb0-11e6-b9d4-539e556f06e1',
          activity: 'ACT-11',
          category: 'DOING',
        },
        {
          id: 111,
          accountId: 'b4be6ba8-fdb0-11e6-b9d4-539e556f06e1',
          activity: 'ACT-12',
          category: 'READY',
        },
        {
          id: 112,
          accountId: 'b4be6ba8-fdb0-11e6-b9d4-539e556f06e1',
          activity: 'ACT-13',
          category: 'HELP',
        },
        {
          id: 113,
          accountId: 'b4be6ba8-fdb0-11e6-b9d4-539e556f06e1',
          activity: 'ACT-14',
          category: 'NOT-SUITABLE',
        },
        {
          id: 114,
          accountId: 'b4be6ba8-fdb0-11e6-b9d4-539e556f06e1',
          activity: 'ACT-15',
          category: 'NOT-SUITABLE',
        },
        {
          id: 115,
          accountId: 'b4be6ba8-fdb0-11e6-b9d4-539e556f06e1',
          activity: 'ACT-16',
          category: 'DOING',
        },
        {
          id: 116,
          accountId: 'b4be6ba8-fdb0-11e6-b9d4-539e556f06e1',
          activity: 'ACT-17',
          category: 'READY',
        },
        {
          id: 117,
          accountId: 'b4be6ba8-fdb0-11e6-b9d4-539e556f06e1',
          activity: 'ACT-18',
          category: 'HELP',
        },
        {
          id: 118,
          accountId: 'b4be6ba8-fdb0-11e6-b9d4-539e556f06e1',
          activity: 'ACT-19',
          category: 'NOT-SUITABLE',
        },
      ]);
    });
};
