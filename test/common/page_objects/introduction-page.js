const IntroductionPage = function IntroductionPage(browser) {
  this.browser = browser;

  this.visitBasePath = () => this.browser.visit('/');
  this.visit = (accountId) => this.browser.visit(`/${accountId}/introduction`);
  this.clickContinue = () => this.browser.click('[data-test="continue"]');
  this.browserPath = () => browser.location.pathname;
};

module.exports = IntroductionPage;
