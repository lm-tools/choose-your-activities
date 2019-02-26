/* eslint-disable */
// this file is copied from Universe

module.exports = class BaseComponent {
  constructor(params, element) {
    this.selector = params.selector;
    this.config = params.config || {};
    this.container = element;
  }
};
