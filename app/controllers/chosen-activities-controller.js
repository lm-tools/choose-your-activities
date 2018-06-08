const express = require('express');
const router = new express.Router({ mergeParams: true });
const ActivitiesModel = require('../models/activity-model');
const ChosenActivitiesViewModel = require('./chosen-activities-view-model');
const CategoryView = require('./category-view-model');
const categoryMapping = require('./category-mapping');

function getCurrentCategory(categoryView, chosenActivities, selectedCategory) {
  let currentCategory;

  if (selectedCategory) {
    currentCategory = selectedCategory;
  } else {
    currentCategory = chosenActivities.then(categories => {
      const categoryToReturn = categoryView.categories.find(category => {
        const activitiesForCategory = categories[category.name];
        return !!activitiesForCategory;
      });
      return categoryToReturn.name;
    });
  }

  return currentCategory;
}

const mapCategories = (categoryView, currentCategoryPromise) => {
  const mappedCategories = currentCategoryPromise.then(currentCategory => {
    return categoryView.categories.map(category => {
      if (category.name === currentCategory) {
        Object.assign(category, { isSelectedCategory: true });
      }
      return category;
    });
  });

  return mappedCategories;
};

router.get('', (req, res) => {
  const accountId = req.params.accountId;
  const group = req.params.group;
  const version = req.params.version;
  const category = req.query.cat;

  const chosenActivities = ActivitiesModel.findSortedByAccountIdAndGroupByCategory(
    accountId, version, group);
  const categoryView = new CategoryView(categoryMapping(version));
  const currentCategory = getCurrentCategory(categoryView, chosenActivities, category);
  const mappedCategories = mapCategories(categoryView, currentCategory);

  mappedCategories.then(result => {
    res.render('chosen-activities', Object.assign({ accountId },
      new ChosenActivitiesViewModel(result)));
  });
});

module.exports = router;
