const helper = require('./support/integrationSpecHelper');
const introductionPage = helper.introductionPage;
const googleTagManagerHelper = helper.googleTagManagerHelper;

const expect = require('chai').expect;
const uuid = require('uuid');

describe('Introduction page', () => {
  const accountId = uuid.v4();
  const version = 'c';

  describe('page outline', () => {
    it('should have correct title', () =>
      introductionPage.visit(version, accountId)
        .then(() => expect(introductionPage.browser.text('title'))
          .to.equal('Choose your activities'))
    );

    it('should contain valid google tag manager data', () =>
      introductionPage.visit(version, accountId)
        .then(() => expect(googleTagManagerHelper.getUserVariable()).to.equal(accountId))
    );

    it('should link to the unsorted activities page', () =>
      introductionPage.visit(version, accountId)
        .then(() => introductionPage.clickContinue())
        .then(() => expect(introductionPage.browserPath())
          .to.contains(`/${version}/${accountId}/activities/unsorted`))
    );
  });
  describe('Visit base path', () => {
    describe('cya-category-proto', () => {
      it('should default to c if no version specified', () =>
        introductionPage.visitBasePath()
          .then(() => {
            const pathParams = introductionPage.pathParams();
            expect(pathParams[1]).to.equal('c');
            expect(pathParams[3]).to.equal('introduction');
          })
      );

      it('should redirect to a/:accountId/introduction for du=e7cf5d5a-0617-4005-8535-16dd99f201ca',
        () =>
          introductionPage.visitBasePath('?du=e7cf5d5a-0617-4005-8535-16dd99f201ca')
            .then(() => {
              const pathParams = introductionPage.pathParams();
              expect(pathParams[1]).to.equal('a');
              expect(pathParams[3]).to.equal('introduction');
            })
      );

      it('should redirect to default version c for a DU which is not there in the config', () =>
        introductionPage.visitBasePath('?du=xyz')
          .then(() => {
            const pathParams = introductionPage.pathParams();
            expect(pathParams[1]).to.equal('c');
            expect(pathParams[3]).to.equal('introduction');
          })
      );
    });
  });
});
