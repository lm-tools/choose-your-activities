const helper = require('./support/integrationSpecHelper');

const categoriseActivityPage = helper.categoriseActivityPage;

const categories = require('../../app/models/categories');

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

    it('should have all of the categories to choose from', () =>
      categoriseActivityPage.visit(accountId, activity)
        .then(() => expect(categoriseActivityPage.countCategories()).to.equal(categories.length))
    );
  });

  describe('user activity', () => {
    before(() => {
      helper.cleanDb();
    });

    it('should store the categorised activity', () =>
      categoriseActivityPage.visit(accountId, 'ACT-1')
      .then(() => categoriseActivityPage.selectCategory('Not really for me'))
      .then(() => helper.getSortedActivities(accountId))
      .then((sortedActivites) => {
        expect(sortedActivites[0].accountId).to.equal(accountId);
        expect(sortedActivites[0].activity).to.equal('ACT-1');
        expect(sortedActivites[0].category).to.equal('NO');
      })
    );

    it('should redirect to unsorted activities after categorisation', () =>
      categoriseActivityPage.visit(accountId, 'ACT-1')
        .then(() => categoriseActivityPage.selectCategory('Not really for me'))
        .then(() => expect(categoriseActivityPage.browserPath())
          .to.equal(`/${accountId}/unsorted-activities/`))
    );
  });
});
