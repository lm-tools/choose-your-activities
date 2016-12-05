const helper = require('./support/integrationSpecHelper');
const categoriseActivityPage = helper.categoriseActivityPage;

const uuid = require('uuid');
const expect = require('chai').expect;

describe('Categorise activity page', () => {
  const accountId = uuid.v4();
  const activity = 'ACT-1';

  describe('page outline', () => {
    it('should have correct heading', () =>
      categoriseActivityPage.visit(accountId, activity)
        .then(() => expect(categoriseActivityPage.headingToBe('Try volunteering')))
    );
  });
});
