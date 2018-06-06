const helper = require('./support/integrationSpecHelper');
const pageUnderTest = helper.activityGroupDetailsPage;
const googleTagManagerHelper = helper.googleTagManagerHelper;

const { expect } = require('chai');
const uuid = require('uuid');

const accountId = uuid.v4();

describe('activity group details', () => {
  ['a', 'b'].forEach((version) => {
    it(`should have correct title for version ${version}`, () =>
      pageUnderTest.visit(version, accountId, 'GRP-3').then(() =>
        expect(pageUnderTest.getTitle()).to.equal('Choose your activities')
      )
    );

    it(`should have correct heading for version ${version}`, () =>
      pageUnderTest.visit(version, accountId, 'GRP-3').then(() => {
        const heading = pageUnderTest.getHeading();
        expect(heading.headingText).to.equal('Your chosen activities');
        expect(heading.subHeadingText).to.equal('Get better at my applications and interviews');
      })
    );

    it(`should contain valid google tag manager data for version ${version}`, () =>
      pageUnderTest.visit(version, accountId, 'GRP-3').then(() =>
        expect(googleTagManagerHelper.getUserVariable()).to.equal(accountId)
      )
    );

    // it(`should have back button for version ${version}`, () =>
    //   pageUnderTest.visit(version, accountId).then(() =>
    //     expect(pageUnderTest.backButtonDisplayed()).to.equal(true)
    //   ));
  });
})
;
