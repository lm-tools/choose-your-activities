const underTest = require('../../../app/controllers/category-mapping');
const expect = require('chai').expect;
const _ = require('lodash');

describe('category mapper', () => {
  [
    {
      version: 'a',
      expectedCategories: [
        'READY',
        'HELP',
        'DOING',
        'NOT-SUITABLE',
      ],
    },
    {
      version: 'b',
      expectedCategories: [
        'READY',
        'HELP',
        'DOING',
        'NOT-SUITABLE',
      ],
    },
    {
      version: 'c',
      expectedCategories: [
        'DOING',
        'READY',
        'HELP',
        'NOT-WORKED',
        'NO',
      ],
    },
    {
      version: '',
      expectedCategories: [
        'DOING',
        'READY',
        'HELP',
        'NOT-WORKED',
        'NO',
      ],
    },
    {
      version: 'd',
      expectedCategories: [
        'DOING',
        'READY',
        'HELP',
        'NOT-WORKED',
        'NO',
      ],
    },
  ].forEach(scenario => {
    it(`should get categories for version ${scenario.version}`, () => {
      const categoriesForVersion = underTest(scenario.version);
      expect(categoriesForVersion).to.eql(scenario.expectedCategories);
      expect(_.uniq(categoriesForVersion).length).to.equals(categoriesForVersion.length);
    });
  });
});
