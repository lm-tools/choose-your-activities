const helper = require('./support/integrationSpecHelper');
const unsortedActivitiesPage = helper.unsortedActivitiesPage;

const expect = require('chai').expect;
const uuid = require('uuid');

describe('Unsorted activities page', () => {
  const accountId = uuid.v4();

  describe('page outline', () => {
    it('should have correct title', () =>
      unsortedActivitiesPage.visit(accountId)
        .then(() => expect(unsortedActivitiesPage.browser.text('title'))
          .to.equal('Sort these activities'))
    );
  });
});
