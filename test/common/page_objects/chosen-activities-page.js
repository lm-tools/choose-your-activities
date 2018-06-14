const extractActivityCountFromContents = (contentsText) => {
  const capture = /^.*\(([0-9]) activit.*\)$/.exec(contentsText);

  if (!capture) throw new Error('Failed to regex capture activity count');

  return Number(capture[1]);
};

class ChosenActivitiesPage {

  constructor(browser, basePath) {
    this.browser = browser;
    this.basePath = basePath;
  }

  visitWithCategory(version, accountId, groupId, category) {
    return this.browser.visit(
      `${this.basePath}/${version}/${accountId}/groups/${groupId}/activities/chosen?cat=${category}`
    );
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

  getCategoryHeading() {
    return this.browser.text('[data-test=category-heading]');
  }

  getTextForListItemNumber(number) {
    const categoryContentsArray =
      Array.from(this.browser.querySelectorAll('li.app-c-contents-list__list-item'));
    const selectedCategoryListItem = categoryContentsArray[number];
    const childNodes = selectedCategoryListItem.childNodes;
    const text = childNodes[0].textContent;
    return text.replace(' ', '').trim();
  }

  getNumberOfCategoryContentsThatAreLinks() {
    return this.browser.querySelectorAll('a.app-c-contents-list__link').length;
  }

  getCategoryContentsTextAsList() {
    const contents = [];

    const currentCategoryText = this.browser.text('li.app-c-contents-list__list-item--active');
    contents.push({
      text: currentCategoryText,
      isLink: false,
      activityCount: extractActivityCountFromContents(currentCategoryText),
    });

    const otherCategories = this.browser.querySelectorAll('a.app-c-contents-list__link');

    Array.from(otherCategories).forEach(category => {
      const text = this.browser.text(category);
      contents.push({
        text,
        isLink: true,
        activityCount: extractActivityCountFromContents(text),
      });
    });

    return contents;
  }

  clickContentsLinkForCategory(category) {
    return this.browser.clickLink(`a.app-c-contents-list__link[href="?cat=${category}"]`);
  }

  backButtonDisplayed() {
    return !!this.browser.query('[class="link-back"]');
  }
}

module.exports = ChosenActivitiesPage;
