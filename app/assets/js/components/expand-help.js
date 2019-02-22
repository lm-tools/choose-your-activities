/* eslint-disable */
// this file is copied from Universe

const BaseComponent = require('../base-component');
const parseTemplate = require('../utils/parse-template');

module.exports = class ExpandHelp extends BaseComponent {
  constructor(params, element) {
    super(params, element);

    this.classes = {
      content: 'expand-help__content',
      isExpanded: 'expand-help--is-expanded',
      heading: 'expand-help__heading',
      disclosureInput: 'expand-help__disclosure-input',
      buttonTpl: 'expand-help__button-tpl',
      hidden: 'js-hidden'
    };

    this.helpSeenValue = 'HIDDEN_HELP_SEEN';
    this.helpNotSeenValue = 'HIDDEN_HELP_NOT_SEEN';

    this.init();
  }

  init() {
    this.initialValue = this.container.dataset.initialValue;

    this.cacheTemplates();
    this.cacheElements();
    this.makeHeadingClickable();
    this.toggleContent(this.isExpanded());
    this.setInitialDisclosureValue();
    this.content.classList.remove(this.classes.hidden);
    this.bindEvents();
  }

  cacheTemplates() {
    this.buttonTpl = this.container.querySelector(`.${this.classes.buttonTpl}`).innerHTML;
  }

  cacheElements() {
    this.content = this.container.querySelector(`.${this.classes.content}`);
    this.heading = this.container.querySelector(`.${this.classes.heading}`);
    this.disclosureInput = this.container.querySelector(`.${this.classes.disclosureInput}`);
    this.button = parseTemplate(this.buttonTpl, {
      contentId: this.content.id,
    });
  }

  bindEvents() {
    this.button.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick() {
    const IS_EXPANDED = this.toggleContent();

    if (IS_EXPANDED) {
      this.setDisclosureValue(this.helpSeenValue);
    }
  }

  makeHeadingClickable() {
    while(this.heading.childNodes.length) {
      this.button.appendChild(this.heading.firstChild);
    }

    this.heading.appendChild(this.button);
  }

  setInitialDisclosureValue() {
    if (!this.isExpanded() && this.initialValue !== this.helpSeenValue) {
      this.setDisclosureValue(this.helpNotSeenValue);
    }
  }

  toggleContent(toggle) {
    if (toggle === undefined) {
      toggle = !this.isExpanded();
    }

    this.button.setAttribute('aria-expanded', toggle);
    this.content.setAttribute('aria-hidden', toggle ? "false" : "true");
    this.container.classList.toggle(this.classes.isExpanded, toggle);

    Array.from(this.content.querySelectorAll('input, select, textarea')).forEach((field) => {
      field.disabled = !toggle;
    });

    return toggle;
  }

  isExpanded() {
    return this.container.classList.contains(this.classes.isExpanded);
  }

  setDisclosureValue(value) {
    if (this.disclosureInput) {
      this.disclosureInput.value = value;
    }
  }
};
