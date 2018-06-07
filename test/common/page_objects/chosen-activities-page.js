class ChosenActivitiesPage {

  constructor(browser, basePath) {
    this.browser = browser;
    this.basePath = basePath;
  }

  visit(version, accountId, groupId) {
    return this.browser.visit(
      `${this.basePath}/${version}/${accountId}/groups/${groupId}/activities/chosen`
    );
  }

  getTitle() {
    return this.browser.text('title');
  }


  getHeading() {
    const headingText = this.browser.text('h1.heading-xlarge');
    const subHeadingText = this.browser.text('h1 .heading-secondary');
    return { headingText: headingText.replace(subHeadingText, '').trim(), subHeadingText };
  }

}

module.exports = ChosenActivitiesPage;
