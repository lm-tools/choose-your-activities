const helper = require('./support/integrationSpecHelper');

const googleTagManagerHelper = helper.googleTagManagerHelper;
const categoriseActivityPage = helper.categoriseActivityPage;

const categories = require('../../app/models/categories');

const uuid = require('uuid');
const expect = require('chai').expect;
const request = require('supertest');

describe('Categorise activity page', () => {
  const accountId = uuid.v4();
  const activity = 'ACT-1';

  describe('page outline', () => {
    before(() => categoriseActivityPage.visit(accountId, activity));

    it('should have correct heading', () =>
      expect(categoriseActivityPage.headingToBe('Find out about volunteering'))
    );

    it('should have all of the categories to choose from', () =>
      expect(categoriseActivityPage.countCategories()).to.equal(categories.length)
    );

    it('should contain valid google tag manager data', () =>
      expect(googleTagManagerHelper.getUserVariable()).to.equal(accountId)
    );

    describe('activityId validation', () => {
      before(() =>
        categoriseActivityPage.visit(accountId, 'ACT-00')
          .catch(() => {})
      );

      it('shows 400 message ', () => {
        expect(helper.errorPage.getMessage()).to.equal('Bad request');
      });

      it('returns 400 code', () =>
        expect(helper.browser.response.status).to.equal(400)
      );
    });
  });

  describe('categorise activity', () => {
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

    describe('activityId validation on POST', () => {
      before(() =>
        request(helper.app)
          .post(`/${accountId}/activities/ACT-99/categorise`)
          .then(response => {
            this.response = response;
          })
      );

      it('shows 400 message ', () => {
        expect(this.response.text).to.include('Bad request');
      });

      it('returns 400 code', () =>
        expect(this.response.status).to.equal(400)
      );
    });
  });

  describe('re-categorise activity', () => {
    beforeEach(() =>
      helper.cleanDb()
        .then(() => helper.addSortedActivities(accountId, [
          { activity, category: 'READY' },
        ]))
        .then(() => categoriseActivityPage.visit(accountId, activity))
    );

    it('should maintain the fact an activity has only one category', () =>
      categoriseActivityPage.selectCategory('Not really for me')
        .then(() => helper.getSortedActivities(accountId))
        .then((sortedActivities) => expect(sortedActivities.length).to.equal(1))
    );

    it('should redirect to re-sort activities after re-categorisation', () =>
      categoriseActivityPage.selectCategory('Not really for me')
        .then(() => expect(categoriseActivityPage.browserPath())
          .to.equal(`/${accountId}/activities/sorted/resort`))
    );
  });
});
