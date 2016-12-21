const helper = require('./support/integrationSpecHelper');

const googleTagManagerHelper = helper.googleTagManagerHelper;
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

    it('should contain valid google tag manager data', () =>
      categoriseActivityPage.visit(accountId, activity)
        .then(() => expect(googleTagManagerHelper.getUserVariable()).to.equal(accountId))
    );
  });

  describe('user activity', () => {
    before(() =>
      helper.cleanDb()
        .then(() => categoriseActivityPage.visit(accountId, activity))
        .then(() => categoriseActivityPage.selectCategory('Not really for me'))
    );

    it('should store the categorised activity', () =>
      helper.getSortedActivities(accountId)
        .then(sortedActivites => {
          expect(sortedActivites[0].accountId).to.equal(accountId);
          expect(sortedActivites[0].activity).to.equal(activity);
          expect(sortedActivites[0].category).to.equal('NO');
        })
    );

    it('should redirect to unsorted activities after categorisation', () =>
      expect(categoriseActivityPage.browserPath()).to.equal(`/${accountId}/activities/unsorted`)
    );

    it('should contain "sorted" query parameter', () =>
      expect(categoriseActivityPage.browserQuery()).to.equal(`?sorted=${activity}`)
    );
  });
});
