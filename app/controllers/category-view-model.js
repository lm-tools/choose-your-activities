const i18n = require('i18n');

module.exports = class CategoryViewModel {

  constructor(categories) {
    this.categories = this.categoryView(categories);
  }

  categoryView(categories) {
    return categories
      .map((category) => Object.assign(
        {
          // eslint-disable-next-line no-underscore-dangle
          title: i18n.__(`category.${category}.title`),
          name: category,
        }));
  }
};
