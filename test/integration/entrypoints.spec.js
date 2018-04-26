const uuid = require('uuid');
const helper = require('./support/integrationSpecHelper');
const browser = helper.browser;
const basePath = helper.basePath;
const introductionPage = helper.introductionPage;
const expect = require('chai').expect;

describe('Entrypoints', () => {
  const accountId = uuid.v4();
  const uuidRegEx = '[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';

  const anonymousEntryPointRegEx = `${uuidRegEx}/introduction`;
  const accountEntryPointRegEx = `/${accountId}/introduction`;

  before(() =>
    helper.cleanDb()
  );

  it('should see the entry page with a generated accountId if entry from root path', () =>
    browser.visit(basePath)
      .then(() => expect(introductionPage.browserPath())
        .to.match(new RegExp(anonymousEntryPointRegEx)))
  );

  it('should see the entry page with referenced accountId', () =>
    browser.visit(`${basePath}/?id=${accountId}`)
      .then(() =>
        expect(introductionPage.browserPath())
          .to.match(new RegExp(accountEntryPointRegEx))
      )
  );
});

