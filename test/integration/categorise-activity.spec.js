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

  [
    {
      version: 'a',
      redirectUri: 'groups/GRP-1/activities',
      queryParam: '',
    },
    {
      version: 'b',
      redirectUri: 'groups/GRP-1/activities',
      queryParam: '',
    },
    {
      version: 'c',
      redirectUri: 'activities/unsorted',
      queryParam: `?sorted=${activity}`,
    }]
    .forEach(scenario =>
      describe(`version: ${scenario.version}`, () => {
        it('should have all of the categories to choose from', () =>
          categoriseActivityPage.visit(scenario.version, accountId, activity)
            .then(() => expect(categoriseActivityPage.countCategories())
              .to
              .equal(categories(scenario.version).length)));
        it('should have correct heading', () =>
          categoriseActivityPage.visit(scenario.version, accountId, activity)
            .then(() => expect(categoriseActivityPage.headingToBe('Find out about volunteering')))
        );
        it('should contain valid google tag manager data', () =>
          categoriseActivityPage.visit(scenario.version, accountId, activity)
            .then(() => expect(googleTagManagerHelper.getUserVariable()).to.equal(accountId))
        );

        describe('activityId validation', () => {
          before(() =>
            categoriseActivityPage.visit(scenario.version, accountId, 'ACT-00')
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
              .then(() => categoriseActivityPage.visit(scenario.version, accountId, activity))
              .then(() => categoriseActivityPage.selectCategory('I\'m ready to try this'))
          );

          it('should store the categorised activity', () =>
            helper.getSortedActivities(accountId)
              .then(sortedActivites => {
                expect(sortedActivites[0].accountId).to.equal(accountId);
                expect(sortedActivites[0].activity).to.equal(activity);
                expect(sortedActivites[0].category).to.equal('READY');
              })
          );

          it('should redirect to unsorted activities after categorisation', () =>
            expect(categoriseActivityPage.browserPath()).to
              .equal(`${categoriseActivityPage.basePath}/${scenario.version}/${accountId}/${scenario.redirectUri}`)
          );

          it('should contain "sorted" query parameter', () =>
            expect(categoriseActivityPage.browserQuery()).to.equal(scenario.queryParam)
          );

          describe('activityId validation on POST', () => {
            before(() =>
              request(helper.app)
                .post(`${categoriseActivityPage.basePath}/${scenario.version}/${accountId}/activities/ACT-99/categorise`)
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
                  .post(`${categoriseActivityPage.basePath}/${scenario.version}/${accountId}/activities/ACT-1/categorise`)
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

        describe('re-categorise activity', () => {
          beforeEach(() =>
            helper.cleanDb()
              .then(() => helper.addSortedActivities(accountId, [
                { activity, category: 'READY' },
              ]))
              .then(() => categoriseActivityPage.visit(scenario.version, accountId, activity))
          );

          it('should maintain the fact an activity has only one category', () =>
            categoriseActivityPage.selectCategory('I\'m ready to try this')
              .then(() => helper.getSortedActivities(accountId))
              .then((sortedActivities) => expect(sortedActivities.length).to.equal(1))
          );

          it('should redirect to re-sort activities after re-categorisation', () =>
            categoriseActivityPage.selectCategory('I\'m ready to try this')
              .then(() => expect(categoriseActivityPage.browserPath())
                .to.equal(`${categoriseActivityPage.basePath}/${scenario.version}/${accountId}/activities/sorted/resort`))
          );
        });
      }));
});
