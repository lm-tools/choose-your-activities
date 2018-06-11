/* eslint-disable no-underscore-dangle */

module.exports = class ChosenActivitiesViewModel {

  constructor(categories) {
    this.categories = categories;
    this.currentCategory = this.categories.filter(category => category.isSelectedCategory);
  }
};
