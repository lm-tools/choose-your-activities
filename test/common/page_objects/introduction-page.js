const IntroductionPage = function IntroductionPage(browser) {
  this.browser = browser;

  this.visitBasePath = () => this.browser.visit('/');
  this.visit = (accountId) => this.browser.visit(`/${accountId}/introduction`);
  this.browserPath = () => browser.location.pathname;
};

module.exports = IntroductionPage;
