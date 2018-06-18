const helper = require('./support/integrationSpecHelper');
const pageUnderTest = helper.chosenActivitiesPage;
const categoriseActivityPage = helper.categoriseActivityPage;
const { googleTagManagerHelper, allActivities } = helper;

const { expect } = require('chai');
const uuid = require('uuid');

const accountId = uuid.v4();

const sortActivityAtIndex = (index, category) =>
  ({ activity: allActivities[index].name, category });

describe('chosen activities page', () => {
  describe('page outline', () => {
    ['a', 'b'].forEach((version) => {
      before((done) =>
        helper.cleanDb()
          .then(() => helper.saveAllActivitiesAsSorted(accountId))
          .then(() => pageUnderTest.visit(version, accountId, 'GRP-6'))
          .then(() => done())
      );

      it(`should have correct title for version ${version}`, () =>
        expect(pageUnderTest.getTitle()).to.equal('Choose your activities')
      );


      it(`should have correct heading for version ${version}`, () => {
        expect(pageUnderTest.getHeading().headingText).to.equal('Your chosen activities');
      });

      it(`should contain valid google tag manager data for version ${version}`, () =>
        expect(googleTagManagerHelper.getUserVariable()).to.equal(accountId)
      );

      it(`should have back button for version ${version}`, () =>
        expect(pageUnderTest.backButtonDisplayed()).to.equal(true)
      );
    });
  });

  describe('page sub heading', () => {
    before(() =>
      helper.cleanDb()
        .then(() => helper.saveAllActivitiesAsSorted(accountId))
    );

    [
      { group: 'GRP-3', subheading: 'Improve how I search online for work' },
      { group: 'GRP-4', subheading: 'Find the right kind of job for me' },
    ].forEach(({ group, subheading }) =>
      it(`should have correct subheading for group ${group} for version a`, () =>
        pageUnderTest.visit('a', accountId, group).then(() =>
          expect(pageUnderTest.getHeading().subHeadingText).to.equal(subheading)
        )
      )
    );

    [
      { group: 'GRP-3', subheading: 'Use the web better' },
      { group: 'GRP-4', subheading: 'Find the right job' },
    ].forEach(({ group, subheading }) =>
      it(`should have correct subheading for group ${group} for version b`, () =>
        pageUnderTest.visit('b', accountId, group).then(() =>
          expect(pageUnderTest.getHeading().subHeadingText).to.equal(subheading)
        )
      )
    );
  });

  describe('categories contents', () => {
    const group = 'GRP-6';

    beforeEach(() =>
      helper.cleanDb().then(() =>
        helper.addSortedActivities(accountId, [
          sortActivityAtIndex(0, 'READY'),
          sortActivityAtIndex(1, 'HELP'),
          sortActivityAtIndex(2, 'DOING'),
          sortActivityAtIndex(3, 'NOT-SUITABLE'),
        ])
      )
    );

    ['a', 'b'].forEach((version) => {
      it(`should link to other category in contents ${version}`, () =>
        pageUnderTest.visit(version, accountId, group).then(() =>
          pageUnderTest.clickContentsLinkForCategory('NOT-SUITABLE').then(() =>
            expect(pageUnderTest.getCategoryHeading()).to.eql('It doesn\'t suit me')
          )
        )
      );

      it(`should include all categories in contents ${version}`, () =>
        pageUnderTest.visit(version, accountId, group).then(() =>
          expect(pageUnderTest.getCategoryContents()).to.length(4)
        )
      );

      it('should not display category with no activities in contents', () =>
        helper.cleanDb().then(() =>
          helper.addSortedActivities(accountId, [
            sortActivityAtIndex(0, 'READY'),
            sortActivityAtIndex(1, 'HELP'),
            sortActivityAtIndex(2, 'DOING'),
          ])
        ).then(() =>
          pageUnderTest.visit(version, accountId, group).then(() =>
            expect(pageUnderTest.getCategoryContents()).to.length(3)
          )
        )
      );

      it('currently selected category should not be a link while all others should be', () =>
        pageUnderTest.visitWithCategory(version, accountId, group, 'HELP').then(() => {
          const categories = pageUnderTest.getCategoryContents();
          const selectedCategory = categories.filter(x => !x.isLink);
          const linkedCategories = categories.filter(x => x.isLink);

          expect(selectedCategory).to.length(1);
          expect(selectedCategory[0].text).to.eql('I\'d like help trying this (1 activity)');
          expect(linkedCategories).to.length(3);
        })
      );

      it('number of activites should be correctly reported', () =>
        helper.cleanDb().then(() =>
          helper.addSortedActivities(accountId, [
            sortActivityAtIndex(0, 'READY'),
            sortActivityAtIndex(1, 'HELP'),
            sortActivityAtIndex(2, 'HELP'),
            sortActivityAtIndex(3, 'DOING'),
            sortActivityAtIndex(4, 'DOING'),
            sortActivityAtIndex(5, 'DOING'),
            sortActivityAtIndex(6, 'NOT-SUITABLE'),
          ])
        ).then(() =>
          pageUnderTest.visitWithCategory(version, accountId, group, 'HELP').then(() => {
            const categories = pageUnderTest.getCategoryContents();
            const [help, ready, doing, notSuitable] = categories;

            expect(categories).to.length(4);
            expect(ready.activityCount).to.equal(1);
            expect(help.activityCount).to.equal(2);
            expect(doing.activityCount).to.equal(3);
            expect(notSuitable.activityCount).to.equal(1);
          })
        )
      );
    });
  });

  describe('more types of activities section', () => {
    beforeEach(() =>
      helper.cleanDb()
        .then(() => helper.addSortedActivities(accountId, [
          sortActivityAtIndex(12, 'READY'),
          sortActivityAtIndex(13, 'HELP'),
          sortActivityAtIndex(18, 'DOING'),
          sortActivityAtIndex(5, 'NOT-SUITABLE'),
        ]))
    );

    it('should list all groups except one for which chosen activities is being displayed', () =>
      pageUnderTest.visit('a', accountId, 'GRP-3').then(() => {
        const moreActivities = pageUnderTest.getMoreActivities();
        expect(moreActivities).to.length(5);
        expect(moreActivities.map(x => x.title)).to.be.eql([
          'Get better at my applications and interviews',
          'Improve my skills and qualifications',
          'Find the right kind of job for me',
          'Give myself some confidence',
          'I don\'t know where to start',
        ]);
      })
    );

    it('link should redirect to the chosen activities page if all activities sorted', () =>
      helper.addSortedActivities(accountId, [
        sortActivityAtIndex(6, 'READY'),
        sortActivityAtIndex(10, 'HELP'),
        sortActivityAtIndex(8, 'DOING'),
        sortActivityAtIndex(7, 'NOT-SUITABLE'),
        sortActivityAtIndex(2, 'NOT-SUITABLE'),
      ]).then(() =>
        pageUnderTest.visit('a', accountId, 'GRP-3').then(() =>
          pageUnderTest.clickLinkForGroup('GRP-1').then(() =>
            expect(pageUnderTest.browserPath()).to
              .contain(`/a/${accountId}/groups/GRP-1/activities/chosen`))
        ))
    );

    it('link should redirect to the list of activities page if all activities are not sorted', () =>
      helper.addSortedActivities(accountId, [
        sortActivityAtIndex(6, 'READY'),
        sortActivityAtIndex(10, 'HELP'),
        sortActivityAtIndex(8, 'DOING'),
        sortActivityAtIndex(7, 'NOT-SUITABLE'),
      ]).then(() =>
        pageUnderTest.visit('a', accountId, 'GRP-3').then(() =>
          pageUnderTest.clickLinkForGroup('GRP-1').then(() =>
            expect(pageUnderTest.browserPath()).to
              .contain(`/a/${accountId}/groups/GRP-1/activities`))
        ))
    );
  });

  describe('change button', () => {
    ['a', 'b'].forEach((version) => {
      beforeEach((done) =>
        helper.cleanDb()
          .then(() => helper.addSortedActivities(accountId, [
            sortActivityAtIndex(2, 'HELP'),
            sortActivityAtIndex(6, 'HELP'),
            sortActivityAtIndex(7, 'HELP'),
            sortActivityAtIndex(8, 'HELP'),
            sortActivityAtIndex(10, 'HELP'),
          ]))
          .then(() => pageUnderTest.visitWithCategory(version, accountId, 'GRP-1', 'HELP'))
          .then(() => done())
      );

      it('should be present for each activity', () => {
        const changeLinks = pageUnderTest.getChangeLinks();
        expect(changeLinks).to.have.length(5);
      });

      it('on click should go to the categorisation page for activity', () =>
        pageUnderTest
          .clickChangeLinkForActivityWithHeading('Update your CV for jobs you\'re interested in')
          .then(() =>
            expect(categoriseActivityPage.heading())
              .to.contain('Update your CV for jobs you\'re interested in')
          )
      );

      it('categorisation page should redirect back to same category', () =>
        pageUnderTest
          .clickChangeLinkForActivityWithHeading('Update your CV for jobs you\'re interested in')
          .then(() =>
            categoriseActivityPage.selectCategory('It doesn\'t suit me').then(() => {
              expect(pageUnderTest.getHeading().headingText).to.eql('Your chosen activities');
              const currentCategory = pageUnderTest.getCategoryContents().find(x => !x.isLink);
              expect(currentCategory.text).to.contain('I\'d like help trying this');
            })
          )
      );

      it('categorisation page should redirect to default category if previous category ' +
        'is now empty', () =>
        helper.cleanDb().then(() =>
          helper.addSortedActivities(accountId, [
            sortActivityAtIndex(2, 'HELP'),
            sortActivityAtIndex(6, 'DOING'),
            sortActivityAtIndex(7, 'DOING'),
            sortActivityAtIndex(8, 'DOING'),
            sortActivityAtIndex(10, 'DOING'),
          ])
        ).then(() => pageUnderTest.visitWithCategory(version, accountId, 'GRP-1', 'HELP'))
          .then(() =>
            pageUnderTest.clickChangeLinkForActivityWithHeading(
              'Get advice from an expert in your industry').then(() =>
              categoriseActivityPage.selectCategory('It doesn\'t suit me').then(() => {
                expect(pageUnderTest.getHeading().headingText).to.eql('Your chosen activities');
                const currentCategory = pageUnderTest.getCategoryContents().find(x => !x.isLink);
                expect(currentCategory.text).to.contain('I\'m already doing this');
              })
            )
          )
      );
    });
  });

  describe('previous and next links', () => {
    beforeEach(() =>
      helper.cleanDb()
        .then(() => helper.addSortedActivities(accountId, [
          sortActivityAtIndex(12, 'READY'),
          sortActivityAtIndex(13, 'HELP'),
          sortActivityAtIndex(18, 'DOING'),
          sortActivityAtIndex(5, 'NOT-SUITABLE'),
        ])));

    it('should be able to navigate using next links', () =>
      pageUnderTest.visit('a', accountId, 'GRP-3').then(() =>
        expect(pageUnderTest.hasPreviousLink()).to.be.false)
        .then(() => {
          const next = pageUnderTest.getNextLink();
          expect(next.title).to.contain('I\'d like help trying this');
          expect(next.href).to.contain('groups/GRP-3/activities/chosen?cat=HELP');
        })
        .then(() =>
          pageUnderTest.clickNext().then(() => {
            const previous = pageUnderTest.getPreviousLink();
            expect(previous.title).to.contain('I\'m ready to try this');
            expect(previous.href).to.contain('groups/GRP-3/activities/chosen?cat=READY');

            const next = pageUnderTest.getNextLink();
            expect(next.title).to.contain('I\'m already doing this');
            expect(next.href).to.contain('groups/GRP-3/activities/chosen?cat=DOING');
          }))
        .then(() =>
          pageUnderTest.clickNext().then(() => {
            const previous = pageUnderTest.getPreviousLink();
            expect(previous.title).to.contain('I\'d like help trying this');
            expect(previous.href).to.contain('groups/GRP-3/activities/chosen?cat=HELP');

            const next = pageUnderTest.getNextLink();
            expect(next.title).to.contain('It doesn\'t suit me');
            expect(next.href).to.contain('groups/GRP-3/activities/chosen?cat=NOT-SUITABLE');
          })
        )
        .then(() =>
          pageUnderTest.clickNext().then(() => {
            const previous = pageUnderTest.getPreviousLink();
            expect(previous.title).to.contain('I\'m already doing this');
            expect(previous.href).to.contain('groups/GRP-3/activities/chosen?cat=DOING');
          }).then(() =>
            expect(pageUnderTest.hasNextLink()).to.be.false
          )
        )
    );

    it('should be able to navigate using previous links', () =>
      pageUnderTest.visitWithCategory('a', accountId, 'GRP-3', 'NOT-SUITABLE').then(() => {
        const previous = pageUnderTest.getPreviousLink();
        expect(previous.title).to.contain('I\'m already doing this');
        expect(previous.href).to.contain('groups/GRP-3/activities/chosen?cat=DOING');
      }).then(() =>
        expect(pageUnderTest.hasNextLink()).to.be.false)
        .then(() =>
          pageUnderTest.clickPrevious().then(() => {
            const previous = pageUnderTest.getPreviousLink();
            expect(previous.title).to.contain('I\'d like help trying this');
            expect(previous.href).to.contain('groups/GRP-3/activities/chosen?cat=HELP');

            const next = pageUnderTest.getNextLink();
            expect(next.title).to.contain('It doesn\'t suit me');
            expect(next.href).to.contain('groups/GRP-3/activities/chosen?cat=NOT-SUITABLE');
          }))
        .then(() =>
          pageUnderTest.clickPrevious().then(() => {
            const previous = pageUnderTest.getPreviousLink();
            expect(previous.title).to.contain('I\'m ready to try this');
            expect(previous.href).to.contain('groups/GRP-3/activities/chosen?cat=READY');

            const next = pageUnderTest.getNextLink();
            expect(next.title).to.contain('I\'m already doing this');
            expect(next.href).to.contain('groups/GRP-3/activities/chosen?cat=DOING');
          }))
        .then(() =>
          pageUnderTest.clickPrevious().then(() =>
            expect(pageUnderTest.hasPreviousLink()).to.be.false)
            .then(() => {
              const next = pageUnderTest.getNextLink();
              expect(next.title).to.contain('I\'d like help trying this');
              expect(next.href).to.contain('groups/GRP-3/activities/chosen?cat=HELP');
            })
        )
    );

    it('should be able to skip a category if no activities assigned to it', () =>
      helper.addSortedActivities(accountId, [
        sortActivityAtIndex(6, 'READY'),
        sortActivityAtIndex(10, 'READY'),
        sortActivityAtIndex(8, 'DOING'),
        sortActivityAtIndex(7, 'DOING'),
        sortActivityAtIndex(2, 'DOING'),
      ])
        .then(() =>
          pageUnderTest.visit('a', accountId, 'GRP-1').then(() =>
            expect(pageUnderTest.hasPreviousLink()).to.be.false)
            .then(() => {
              const next = pageUnderTest.getNextLink();
              expect(next.title).to.contain('I\'m already doing this');
              expect(next.href).to.contain('groups/GRP-1/activities/chosen?cat=DOING');
            })
            .then(() => pageUnderTest.clickNext())
            .then(() => {
              const previous = pageUnderTest.getPreviousLink();
              expect(previous.title).to.contain('I\'m ready to try this');
              expect(previous.href).to.contain('groups/GRP-1/activities/chosen?cat=READY');
            })
            .then(() =>
              expect(pageUnderTest.hasNextLink()).to.be.false
            )));
  });
});
