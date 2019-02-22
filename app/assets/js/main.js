require('./_hide-show');
const Slider = require('./_slider');
const ExpandHelp = require('./components/expand-help');

$(document).ready(() => {
  // Use GOV.UK selection-buttons.js to set selected
  // and focused states for block labels
  const $blockLabels = $(".block-label input[type='radio'], .block-label input[type='checkbox']");
  // eslint-disable-next-line no-new
  new GOVUK.SelectionButtons($blockLabels);

  const slideElements = $('[data-slide]');
  if (slideElements) {
    new Slider(slideElements).slide();
  }

  Array.from(document.querySelectorAll('.expand-help')).forEach((element) => {
    // eslint-disable-next-line no-new
    new ExpandHelp({}, element);
  });
});
