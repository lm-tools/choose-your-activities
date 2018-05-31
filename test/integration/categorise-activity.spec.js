const helper = require('./support/integrationSpecHelper');

const googleTagManagerHelper = helper.googleTagManagerHelper;
const categoriseActivityPage = helper.categoriseActivityPage;

const categories = require('../../app/controllers/category-mapping');

const uuid = require('uuid');
const expect = require('chai').expect;
const request = require('supertest');

describe('Categorise activity page', () => {
  const accountId = uuid.v4();
  const activity = 'ACT-1';


  it('should have correct heading', () =>
    categoriseActivityPage.visit('c', accountId, activity)
      .then(() => expect(categoriseActivityPage.headingToBe('Find out about volunteering')))
  );

  ['a', 'b', 'c']
    .forEach(version =>
      it(`should have all of the categories to choose from for version ${version}`, () =>
        categoriseActivityPage.visit(version, accountId, activity)
          .then(() => expect(categoriseActivityPage.countCategories())
            .to.equal(categories(version).length)))
    );

  it('should have all of the categories for version a', () =>
    categoriseActivityPage.visit('a', accountId, activity)
      .then(() => expect(categoriseActivityPage.countCategories())
        .to.equal(categories('a').length))
  );

  it('should contain valid google tag manager data', () =>
    categoriseActivityPage.visit('c', accountId, activity)
      .then(() => expect(googleTagManagerHelper.getUserVariable()).to.equal(accountId))
  );

  describe('activityId validation', () => {
    before(() =>
      categoriseActivityPage.visit('c', accountId, 'ACT-00')
        .catch(() => {
        })
    );

    it('shows 400 message ', () => {
      expect(helper.errorPage.getMessage()).to.equal('We\'re experiencing technical problems.');
    });

    it('returns 400 code', () =>
      expect(helper.browser.response.status).to.equal(400)
    );
  });

  describe('categorise activity', () => {
    before(() =>
      helper.cleanDb()
        .then(() => categoriseActivityPage.visit('c', accountId, activity))
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
      expect(categoriseActivityPage.browserPath()).to
        .equal(`${categoriseActivityPage.basePath}/c/${accountId}/activities/unsorted`)
    );

    it('should contain "sorted" query parameter', () =>
      expect(categoriseActivityPage.browserQuery()).to.equal(`?sorted=${activity}`)
    );

    describe('activityId validation on POST', () => {
      before(() =>
        request(helper.app)
          .post(`${categoriseActivityPage.basePath}/c/${accountId}/activities/ACT-99/categorise`)
          .send({ category: categories[1] })
          .then(response => {
            this.response = response;
          })
      );

      it('shows 400 message ', () => {
        expect(this.response.text).to.include('We&#39;re experiencing technical problems.');
      });

      it('returns 400 code', () =>
        expect(this.response.status).to.equal(400)
      );
    });

    [
      { body: {}, title: 'empty category validation on POST' },
      { body: { category: 'bad-category' }, title: 'wrong category validation on POST' },
    ].forEach(s => {
      describe(s.title, () => {
        before(() =>
          request(helper.app)
            .post(`${categoriseActivityPage.basePath}/c/${accountId}/activities/ACT-1/categorise`)
            .send(s.body)
            .then(response => {
              this.response = response;
            })
        );

        it('shows 400 message ', () => {
          expect(this.response.text).to.include('We&#39;re experiencing technical problems.');
        });

        it('returns 400 code', () =>
          expect(this.response.status).to.equal(400)
        );
      });
    });
  });

  describe('categorise activity for version a', () => {
    before(() =>
      helper.cleanDb()
        .then(() =>
          categoriseActivityPage.visitFromActivityGroupPage('a', accountId, 'GRP-2', activity))
        .then(() =>
          categoriseActivityPage.selectCategory('It doesn\'t suit me'))
    );

    it('should store the categorised activity', () =>
      helper.getSortedActivities(accountId)
        .then(sortedActivites => {
          expect(sortedActivites[0].accountId)
            .to
            .equal(accountId);
          expect(sortedActivites[0].activity)
            .to
            .equal(activity);
          expect(sortedActivites[0].category)
            .to
            .equal('NOT-SUITABLE');
        })
    );

    it('should redirect the user to activities page', () =>
      expect(categoriseActivityPage.browserPath())
        .to.equal(`${categoriseActivityPage.basePath}/a/${accountId}/groups/GRP-2/activities`)
    );
  });


  describe('re-categorise activity', () => {
    beforeEach(() =>
      helper.cleanDb()
        .then(() => helper.addSortedActivities(accountId, [
          { activity, category: 'READY' },
        ]))
        .then(() => categoriseActivityPage.visit('a', accountId, activity))
    );

    it('should maintain the fact an activity has only one category', () =>
      categoriseActivityPage.selectCategory('It doesn\'t suit me')
        .then(() => helper.getSortedActivities(accountId))
        .then((sortedActivities) => expect(sortedActivities.length).to.equal(1))
    );

    it('should redirect to re-sort activities after re-categorisation', () =>
      categoriseActivityPage.selectCategory('It doesn\'t suit me')
        .then(() => expect(categoriseActivityPage.browserPath())
          .to.equal(`${categoriseActivityPage.basePath}/a/${accountId}/activities/sorted/resort`))
    );
  });
});
